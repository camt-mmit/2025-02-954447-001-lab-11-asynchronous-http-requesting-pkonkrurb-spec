import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { filmResource } from '../../helpers/resources';
import { FilmView } from '../../components/film-view/film-view';

@Component({
  selector: 'app-film-view-page',
  standalone: true,
  imports: [FilmView],
  template: `
    @if (film.isLoading()) { <p>Loading film...</p> }
    @else if (film.value(); as data) { <app-film-view [data]="data" /> }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilmViewPage {
  readonly id = input.required<string>();
  protected readonly film = filmResource(() => this.id());
}
