import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { EventResourceInsertModel } from '../../helpers/google/calendar';

@Component({
  selector: 'app-event-field-tree',
  imports: [FormField],
  templateUrl: './event-field-tree.html',
  styleUrl: './event-field-tree.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventFieldTree {
  readonly fieldTree = input.required<FieldTree<EventResourceInsertModel>>();
}
