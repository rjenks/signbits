import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventScheduleComponent } from './event-schedule/event-schedule.component';
import { RoomScheduleComponent } from './room-schedule/room-schedule.component';
import { PortalComponent } from './portal/portal.component';

const routes: Routes = [
  {
    path: '',
    component: PortalComponent
  },
  {
    path: 'event',
    component: EventScheduleComponent
  },
  {
    path: 'room/:label/:name',
    component: RoomScheduleComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
