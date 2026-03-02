import { ChangeDetectionStrategy, Component, Injector, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ExtractIdPipe } from '../../pipes/extract-id-pipe';
import { Person } from '../../types';

@Component({
  selector: 'app-people-list',
  imports: [RouterLink, ExtractIdPipe],
  templateUrl: './people-list.html',
  styleUrl: './people-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeopleList {
  readonly data = input.required<readonly Person[]>();

  private readonly injector = inject(Injector);
}
