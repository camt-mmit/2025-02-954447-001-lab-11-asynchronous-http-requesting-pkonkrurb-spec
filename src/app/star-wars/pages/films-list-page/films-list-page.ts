import { ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal } from '@angular/core';
import { filmsListResource, purnEmptyProperties } from '../../helpers';
import { disabled, form, FormField, submit } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { FilmsList } from '../../components/films-list/films-list';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-films-list-page',
  imports: [ FilmsList, FormField, RouterLink, DecimalPipe],
  templateUrl: './films-list-page.html',
  styleUrl: './films-list-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilmsListPage {
readonly search = input<string>();
  readonly page = input<string>();

  protected readonly params = computed(
    () =>
      ({
        search: this.search() ?? '',
        page: this.page() ?? '',
      }) as const,
  );

  protected readonly resource = filmsListResource(() =>
    purnEmptyProperties(this.params()),
  ).asReadonly();
   protected readonly currentPage = computed(() => +(this.params().page ? this.params().page : '1'));

  protected readonly previousPage = computed(() =>
    this.resource.hasValue() && this.resource.value().previous
      ? new URL(this.resource.value().previous!).searchParams.get('page')
      : null,
  );

  protected readonly nextPage = computed(() =>
    this.resource.hasValue() && this.resource.value().next
      ? new URL(this.resource.value().next!).searchParams.get('page')
      : null,
  );

  protected readonly form = form(
    linkedSignal(() => ({ search: this.params().search }) as const),
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
