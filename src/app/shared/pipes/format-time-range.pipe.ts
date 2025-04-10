import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTimeRange'
})
export class FormatTimeRangePipe implements PipeTransform {

  transform(value: string): string {
    const [start, end] = value.split('-');
    return `${start}-tól – ${end}-ig`;
  }
  
}
