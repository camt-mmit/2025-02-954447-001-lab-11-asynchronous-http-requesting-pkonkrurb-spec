import { Pipe, PipeTransform } from '@angular/core';
import { extractNestedDate } from '../helpers/google/calendar';
import { NestedDate } from '../types/google/calendar';

@Pipe({
  name: 'extractNestedDate',
})
export class ExtractNestedDatePipe implements PipeTransform {
  transform(value: NestedDate): string {
    return extractNestedDate(value);
  }
}
