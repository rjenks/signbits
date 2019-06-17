import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'blockType'
})
export class BlockTypePipe implements PipeTransform {

  transform(event: any, type: any): any {
    return event ? event.filter(event => event['type'] == type) : undefined;
  }

}
