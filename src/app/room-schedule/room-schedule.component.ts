import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ScheduleService } from '../schedule.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { StorageService } from '../storage.service';

declare var chrome;
declare var window;

@Component({
  selector: 'app-room-schedule',
  templateUrl: './room-schedule.component.html',
  styleUrls: ['./room-schedule.component.scss']
})
export class RoomScheduleComponent implements OnInit, OnDestroy {
  label: String;
  name: String;
  schedule$: Object;
  interval: any;
  version: String = chrome.runtime.getManifest ? chrome.runtime.getManifest().version : '0.0.0';
  id: String;

  constructor(
    private scheduleService: ScheduleService, 
    private route: ActivatedRoute,
    private storageService: StorageService
  ) {
    this.label = this.route.snapshot.paramMap.get("label");
    this.name = this.route.snapshot.paramMap.get("name");
    this.route.paramMap.pipe(switchMap((params: ParamMap) => this.label = params.get("label")));
    this.route.paramMap.pipe(switchMap((params: ParamMap) => this.name = params.get("name")));

    chrome.nfc.findDevices(function(devices) {
      console.log("Found " + devices.length + " NFC device(s)");
      for (var i = 0; i < devices.length; i++) {
        var device = devices[i];
        console.log(device.vendorId, device.productId);
      }
    });
  }

  ngOnInit() {
    this.storageService.getUUID((id) => {
      this.id = id;
    });
    this.refreshSchedule();
    this.interval = setInterval(() => { 
        this.refreshSchedule(); 
    }, 300000);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  refreshSchedule() {
    this.scheduleService.getNow()
    .subscribe(
      schedule => {
        this.schedule$ = schedule;
      }
    );
  }

}
