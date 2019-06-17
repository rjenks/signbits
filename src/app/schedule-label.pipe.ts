import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'scheduleLabel'
})
export class ScheduleLabelPipe implements PipeTransform {

  transform(event: any, label: any): any {
    return event ? event.filter(event => event['schedule_label'] == label) : undefined;
  }

}
