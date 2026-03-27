import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ExtractNestedDatePipe } from '../../pipes/extract-nested-date-pipe';
import { EventResource } from '../../types/google/calendar';

@Component({
  selector: 'app-events-list',
  imports: [ExtractNestedDatePipe, DatePipe],
  templateUrl: './events-list.html',
  styleUrl: './events-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsList {
  readonly data = input.required<readonly EventResource[]>();
}
