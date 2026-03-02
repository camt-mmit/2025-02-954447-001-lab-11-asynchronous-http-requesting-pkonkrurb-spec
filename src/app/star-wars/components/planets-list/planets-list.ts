import { ChangeDetectionStrategy, Component, inject, Injector, input } from '@angular/core';
import { Planet } from '../../types';
import { ExtractIdPipe } from '../../pipes/extract-id-pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-planets-list',
  imports: [RouterLink, ExtractIdPipe],
  templateUrl: './planets-list.html',
  styleUrl: './planets-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanetsList {
 readonly data = input.required<readonly Planet[]>();

  private readonly injector = inject(Injector);
}
