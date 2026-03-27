import { ChangeDetectionStrategy, Component, inject, linkedSignal, signal } from '@angular/core';
import { FormField, form, submit } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { PeopleService, Person } from '../../services/people';

@Component({
  selector: 'app-people-list-page',
  imports: [RouterLink, FormField],
  templateUrl: './people-list-page.html',
  styleUrl: './people-list-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeopleListPage {
  private readonly service = inject(PeopleService);

  protected readonly resource = this.service.connectionsResource();

  protected readonly searchQuery = signal('');

  protected readonly filteredConnections = linkedSignal<Person[]>(() => {
    const connections = this.resource.value()?.connections ?? [];
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return connections;
    return connections.filter((person) => {
      const name = this.getDisplayName(person).toLowerCase();
      const emails = (person.emailAddresses ?? [])
        .map((e) => e.value ?? '')
        .join(' ')
        .toLowerCase();
      const phones = (person.phoneNumbers ?? [])
        .map((p) => p.value ?? '')
        .join(' ')
        .toLowerCase();
      return name.includes(q) || emails.includes(q) || phones.includes(q);
    });
  });
  protected readonly form = form(signal({ q: '' } as const));

  protected onSearch(): void {
    submit(this.form, async (form) => {
      this.searchQuery.set(form().value().q);
    });
  }

  protected clearSearch(): void {
    this.form.q().value.set('');
    this.searchQuery.set('');
  }

  protected getDisplayName(person: Person): string {
    const name = person.names?.[0];
    if (!name) return '(No name)';
    return name.displayName ?? `${name.givenName ?? ''} ${name.familyName ?? ''}`.trim();
  }

  protected getInitials(person: Person): string {
    return this.getDisplayName(person)
      .split(' ')
      .map((n) => n[0] ?? '')
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  protected getPhotoUrl(person: Person): string | null {
    const photo = person.photos?.[0];
    return photo && !photo.default ? (photo.url ?? null) : null;
  }
}
