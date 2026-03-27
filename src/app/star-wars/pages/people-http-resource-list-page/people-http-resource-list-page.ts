import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, input, linkedSignal } from '@angular/core';
import { FormField, disabled, form, submit } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { purnEmptyProperties } from '../../helpers';
import { Person, ResultsList } from '../../types';

@Component({
  selector: 'app-people-http-resource-list-page',
  imports: [FormField],
  templateUrl: './people-http-resource-list-page.html',
  styleUrl: './people-http-resource-list-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeopleHttpResourceListPage {
  readonly search = input<string>();

protected readonly resource = httpResource<ResultsList<Person>>(() => {
  const searchTerm = this.search();
  return {
    url: 'https://swapi.dev/api/people',
    // เปลี่ยนจาก undefined เป็น {} (Object ว่าง) 
    params: searchTerm ? { search: searchTerm } : {}
  };
});
  protected readonly form = form(
    linkedSignal(() => ({ search: this.search() ?? '' })),
    (path) => {
      disabled(path, () => this.resource.isLoading());
    },
  );

  private readonly router = inject(Router);

  protected onSearch(): void {
    submit(
      this.form,
      async (form) =>
        void this.router.navigate([], {
          queryParams: purnEmptyProperties(form().value()),
          replaceUrl: true,
        }),
    );
  }

  protected clearSearch(): void {
    this.form.search().value.set('');
    this.onSearch();
  }
}
