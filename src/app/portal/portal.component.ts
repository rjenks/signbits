import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PortalService } from '../portal.service';
import { StorageService } from '../storage.service';

declare var window;
declare var chrome;

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.scss']
})
export class PortalComponent implements OnInit {

  id: String;
  interval: any;
  version: String = chrome.runtime.getManifest ? chrome.runtime.getManifest().version : '0.0.0';

  constructor(
    private router: Router,
    private portalService: PortalService,
    private storageService: StorageService
  ) {

  }
  
  ngOnInit() {
    this.storageService.getUUID((id) => {
      this.id = id;
      this.refreshConfig();
    });
    this.interval = setInterval(() => { 
        this.refreshConfig(); 
    }, 10000);
  }

  refreshConfig() {
    window.console.log("id=" + this.id);
    this.portalService.getConfig(this.id)
      .subscribe(
        (config: any[]) => {
          if (config != null && config.length > 0) {
            this.router.navigate(config);
          }
        }
      );
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }
}
