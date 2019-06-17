import { Component, OnInit, OnDestroy } from '@angular/core';
import { ScheduleService } from '../schedule.service';
import { StorageService } from "../storage.service";
declare var chrome;
declare var window;

@Component({
  selector: 'app-event-schedule',
  templateUrl: './event-schedule.component.html',
  styleUrls: ['./event-schedule.component.scss']
})
export class EventScheduleComponent implements OnInit, OnDestroy {

  schedule$: Object;
  interval: any;
  version: String = chrome.runtime.getManifest ? chrome.runtime.getManifest().version : '0.0.0';
  id: String;

  constructor(
    private scheduleService: ScheduleService,
    private storageService: StorageService
  ) { }

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
    this.scheduleService.getNow().subscribe(
      schedule => {
        this.schedule$ = schedule;
      }
    );
  }

}
