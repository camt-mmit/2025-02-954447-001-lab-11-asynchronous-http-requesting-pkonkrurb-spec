import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, linkedSignal } from '@angular/core';
import { FormField, form, submit } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { EventsList } from '../../components/events-list/events-list';
import { LoadTrigger } from '../../components/load-trigger/load-trigger';
import { purnEmptyProperties } from '../../helper';
import { CalendarService } from '../../services/calendar.service';
import { EventsResource, EventsResourceQueryOptions } from '../../types/google/calendar';

const defalutParams: Partial<EventsResourceQueryOptions['params']> = {
  maxResults: 25,
  eventTypes: ['default'],
  singleEvents: true,
  orderBy: 'startTime',
};

@Component({
  selector: 'app-events-list-page',
  imports: [EventsList, FormField, DatePipe, LoadTrigger, RouterLink],
  templateUrl: './events-list-page.html',
  styleUrl: './events-list-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsListPage {
  private readonly service = inject(CalendarService);

  readonly q = input<string>();

  protected readonly params = linkedSignal(() => ({
    calendarId: 'primary',
    params: {
      ...defalutParams,
      // timeMin: new Date().toISOString(),
      ...(this.q() ? { q: this.q()! } : {}),
    },
  }));

  protected readonly resource = this.service.eventsResource(this.params);

  protected readonly items = linkedSignal({
    source: () => (this.resource.hasValue() ? this.resource.value().items : null),
    computation: (source, previous): EventsResource['items'] | null => {
      if (source === null) {
        return previous?.value ?? null;
      } else {
        return [...(previous?.value ?? []), ...source];
      }
    },
  });

  protected readonly form = form(
    linkedSignal(() => ({ q: this.params().params?.q ?? '' }) as const),
  );

  private readonly router = inject(Router);

  protected onSearch(): void {
    submit(this.form, async (form) => {
      this.items.set(null);

      void this.router.navigate([], {
        queryParams: purnEmptyProperties(form().value()),
        replaceUrl: true,
      });
    });
  }

  protected clearSearch(): void {
    this.form.q().value.set('');
    this.onSearch();
  }

  protected getMore(pageToken: string): void {
    this.params.update(({ calendarId, params }) => ({
      calendarId,
      params: {
        ...params,
        pageToken,
      },
    }));
  }
}
