import { ChangeDetectionStrategy, Component, inject, Injector, input } from '@angular/core';
import { Film } from '../../types';
import { ExtractIdPipe } from '../../pipes/extract-id-pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-films-list',
  imports: [RouterLink, ExtractIdPipe],
  templateUrl: './films-list.html',
  styleUrl: './films-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilmsList {
  readonly data = input.required<readonly Film[]>();

  private readonly injector = inject(Injector);
}
