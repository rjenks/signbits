import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventScheduleComponent } from './event-schedule/event-schedule.component';
import { RoomScheduleComponent } from './room-schedule/room-schedule.component';
import { ScheduleLabelPipe } from './schedule-label.pipe';
import { BlockTypePipe } from './block-type.pipe';
import { PortalComponent } from './portal/portal.component';


@NgModule({
  declarations: [
    AppComponent
    ,EventScheduleComponent
    ,RoomScheduleComponent, ScheduleLabelPipe, BlockTypePipe, PortalComponent
  ]
  ,imports: [
    BrowserModule
    ,AppRoutingModule
    ,HttpClientModule
  ]
  ,providers: []
  ,bootstrap: [AppComponent]
})
export class AppModule { }
