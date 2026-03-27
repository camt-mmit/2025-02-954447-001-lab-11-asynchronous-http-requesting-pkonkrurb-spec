import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, submit } from '@angular/forms/signals';
import { EventFieldTree } from '../../components/event-field-tree/event-field-tree';
import { createNavigateBack } from '../../helper';
import {
  eventResourceInsertSchema,
  extractCalendarErrorObjects,
  toEventResourceInsertBody,
  toEventResourceInsertModel,
} from '../../helpers/google/calendar';
import { CalendarService } from '../../services/calendar.service';
import { FormPage } from '../types';


@Component({
  selector: 'app-event-insert-page',
  imports: [EventFieldTree],
  templateUrl: './event-insert-page.html',
  styleUrl: './event-insert-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventInsertPage implements FormPage {
  protected readonly fieldTree = form(
    signal(toEventResourceInsertModel()),
    eventResourceInsertSchema,
  );

  private readonly service = inject(CalendarService);

  dirty(): boolean {
    return this.fieldTree().dirty();
  }

  protected readonly navigateBack = createNavigateBack();

  protected async save(): Promise<void> {
    await submit(this.fieldTree, async (fieldTree) => {
      const body = toEventResourceInsertBody(fieldTree().value());

      try {
        await this.service.insertEvent({
          calendarId: 'primary',
          body,
        });

        return;
      } catch (error) {
        if (error instanceof HttpErrorResponse && error.status === 0) {
          throw error;
        }

        console.error(error);

        return extractCalendarErrorObjects(error).map((error) => ({
          kind: 'server-error',
          message: error.message,
        }));
      }
    });

    if (this.fieldTree().valid()) {
      this.fieldTree().reset();
      this.navigateBack();
    }
  }

  protected cancel(): void {
    this.navigateBack();
  }
}
