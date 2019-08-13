import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../storage.service';
import { AccessService } from '../access.service';

declare var chrome: any;

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.scss']
})

export class PortalComponent implements OnInit {
  id: string;
  configured: boolean = false;
  configError: string;
  token: string;
  configInterval: any;
  version: string = chrome.runtime.getManifest ? chrome.runtime.getManifest().version : '0.0.0';

  constructor(
    private router: Router,
    private storageService: StorageService,
    private accessService: AccessService
  ) {

  }
  
  ngOnInit() {
    this.refreshConfig();
    this.configInterval = setInterval(() => { 
        this.refreshConfig(); 
    }, 10000);
  }

  onEnterToken(token: string) {
    this.token = token;
    this.storageService.setToken(token);
    console.log('token = ', this.token);
  }

  async refreshConfig() {
    this.configError = null;
    if (!this.id) {
      this.id = await this.storageService.getUUID();
    }
    this.token = await this.storageService.getToken();
    let registerObservable = await this.accessService.register();
    try {
      await registerObservable.toPromise();
    } catch (err0r) {
      this.configError = err0r;
      console.log('registration error', err0r);
      return;
    }
    let ob = await this.accessService.getKioskConfig();
    this.configured = true;
    ob.subscribe(
      (config: any[]) => {
        if (config != null && config.length > 0) {
          this.router.navigate(config);
        }
      }
    );
  }

  ngOnDestroy() {
    clearInterval(this.configInterval);
  }
}
