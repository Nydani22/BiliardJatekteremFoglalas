import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'date'
})
export class DatePipe implements PipeTransform {

  transform(value: unknown): string {
    if (!value) return '';

    const dateObj = new Date(value as string);
    if (isNaN(dateObj.getTime())) return '';

    const year = dateObj.getFullYear();
    const month = this.padZero(dateObj.getMonth() + 1);
    const day = this.padZero(dateObj.getDate());

    return `${year}-${month}-${day}`;
  }

  private padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }
}
