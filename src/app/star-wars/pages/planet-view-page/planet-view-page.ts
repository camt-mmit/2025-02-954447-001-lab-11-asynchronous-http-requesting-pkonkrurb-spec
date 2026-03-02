import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ModuleActivatedRoute } from '../../tokens';
import { planetResource } from '../../helpers';
import { PlanetView } from '../../components/planet-view/planet-view';
import { Location } from '@angular/common';

@Component({
  selector: 'app-planet-view-page',
  imports: [PlanetView],
  templateUrl: './planet-view-page.html',
  styleUrl: './planet-view-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanetViewPage {
  readonly id = input.required<string>();
  protected moduleRoute = inject(ModuleActivatedRoute);

    protected readonly resource = planetResource(this.id).asReadonly();

  private readonly location = inject(Location);

  protected goBack(): void {
    this.location.back();
}
}
