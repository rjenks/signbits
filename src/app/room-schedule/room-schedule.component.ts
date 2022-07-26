import { Component, OnInit, OnDestroy, Input, ChangeDetectorRef } from '@angular/core';
import { ScheduleService } from '../schedule.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { StorageService } from '../storage.service';
import { AccessService } from '../access.service';

declare var chrome: any;
declare var BigInt: any;
declare var Audio: any;

interface Toast {
  uid: string;
  type: string;
}

@Component({
  selector: 'app-room-schedule',
  templateUrl: './room-schedule.component.html',
  styleUrls: ['./room-schedule.component.scss']
})

export class RoomScheduleComponent implements OnInit, OnDestroy {
  label: string;
  name: string;
  logo: string;
  schedule$: Object;
  refreshScheduleInterval: any;
  refreshAccessInterval: any;
  version: string = chrome.runtime.getManifest ? chrome.runtime.getManifest().version : '0.0.0';
  id: string;
  lastUpdateTime: string = "0";
  allow: Set<string> = new Set<string>();
  revoke: Set<string> = new Set<string>();
  toasts: Toast[] = [];
  badgeInterval: any;
  findDeviceInterval: any;
  nfcDevice: any;
  successSound: any;
  failureSound: any;
  unknownSound: any;

  constructor(
    private scheduleService: ScheduleService, 
    private accessService: AccessService,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private ref: ChangeDetectorRef
  ) {
    this.label = this.route.snapshot.paramMap.get("label");
    this.name = this.route.snapshot.paramMap.get("name");
    switch (this.label) {
      case "GP":
        this.logo = "/assets/logo-gamefest.png";
        break;
      case "DR":
        this.logo = "/assets/logo-worldfandom.png";
        break;
      default:
        this.logo = "/assets/logo-animefest.png";
        break;
    }
    this.route.paramMap.pipe(switchMap((params: ParamMap) => this.label = params.get("label")));
    this.route.paramMap.pipe(switchMap((params: ParamMap) => this.name = params.get("name")));
  }

  ngOnInit() {
    this.storageService.getUUID().then(id => {
      this.id = id;
    });

    this.refreshSchedule();
    this.refreshScheduleInterval = setInterval(() => { 
      this.refreshSchedule(); 
    }, 300000);

    this.refreshAccess();
    this.refreshAccessInterval = setInterval(() => {
      this.refreshAccess();
    }, 5000);

    this.findDeviceInterval = setInterval(() => {
      if (!this.nfcDevice) {
        console.log("Looking for NFC Devices");
        chrome.nfc.findDevices((devices) => {
          this.nfcDevice = devices[0];
          console.log('Found NFC Reader:', this.nfcDevice.vendorId, this.nfcDevice.productId);
          this.ref.detectChanges();
          this.badgeInterval = setInterval(() => {
            this.waitForBadge();
          }, 300);
        });
      }
    }, 5000);

    this.successSound = new Audio('/assets/aye_matie.wav');
    this.failureSound = new Audio('/assets/walk_the_plank.wav');
    this.unknownSound = new Audio('/assets/avast.wav');

    // Add test badge
    this.revoke.add("1397879016868224");
  }

  ngOnDestroy() {
    clearInterval(this.refreshScheduleInterval);
    clearInterval(this.refreshAccessInterval);
    clearInterval(this.badgeInterval);
  }

  refreshSchedule() {
    this.scheduleService.getNow()
    .subscribe(
      schedule => {
        this.schedule$ = schedule;
      }
    );
  }

  addToast(uid: string, type: string) {
    let idScheduleBlock = null;
    try {
      idScheduleBlock = this.schedule$[0]["id_schedule_block"];
    } catch (e) {}
    let toast: Toast = {uid: uid, type: type};
    for (let i = 0; i < this.toasts.length; i++) {
      if (uid === this.toasts[i].uid) {
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ toast already exists for uid', uid);
        return;
      }
    }
    console.log('+++++++++++++++++++++++++++++++ adding toast for uid', uid);
    this.toasts.push(toast);
    this.ref.detectChanges();
    if (type === 'allow') {
      this.successSound.play();
      this.accessService.addAccessLog(uid, this.label, idScheduleBlock);
    } else if (type === 'revoke') {
      this.failureSound.play();
    } else {
      this.unknownSound.play();
    }
    setTimeout(() => {
      this.toasts.shift();
      this.ref.detectChanges();
    }, 3000);
  }

  async refreshAccess() {
    (await this.accessService.getBadgeList(this.lastUpdateTime))
    .subscribe(accessUpdate => {
      this.lastUpdateTime = accessUpdate.newUpdateTime;
      for (let i = 0; i < accessUpdate.allow.length; i++) {
        this.allow.add(accessUpdate.allow[i]);
      }
      for (let i = 0; i < accessUpdate.revoke.length; i++) {
        this.revoke.add(accessUpdate.revoke[i]);
        this.allow.delete(accessUpdate.revoke[i]);
      }
    });
  }

  waitForBadge() {
    if (this.nfcDevice) {
      chrome.nfc.wait_for_tag(this.nfcDevice, 250, (tag_type, tag_id: ArrayBuffer) => {
        if (tag_id) {
          let uid = this.tagToDecimalString(tag_id);
          let type = 'unknown';
          if (this.revoke.has(uid)) {
            type = 'revoke';
          } else if (this.allow.has(uid)) {
            type = 'allow';
          }
          console.log('found tag:', tag_type, tag_id, uid);
          this.addToast(uid, type);
        }
        // let timeout = tag_id ? 1300 : 250;
        // setTimeout(() => {this.waitForBadge();}, timeout);
      });
    }
  }

  private tagToDecimalString(tag_id: ArrayBuffer) {
    let s = Array.prototype.map.call(new Uint8Array(tag_id), x => ('00' + x.toString(16)).slice(-2)).join('');
    let bigInt = BigInt('0x' + s);
    return bigInt.toString(10);
  }

  // readBadge() {
  //   if (this.nfcDevice) {
  //     chrome.nfc.read(this.nfcDevice, {'timeout': 2000}, function(type, ndef) {
  //       console.log('type:', type);
  //       console.log('ndef:', ndef);
  //       var uri = ndef.ndef[0]["uri"];
  //       console.log(uri);
  //     });
  //   } else {
  //     chrome.nfc.findDevices((devices) => {
  //       this.nfcDevice = devices[0];
  //       console.log('Found NFC Reader:', this.nfcDevice.vendorId, this.nfcDevice.productId);
  //     });  
  //   }
  // }


}
