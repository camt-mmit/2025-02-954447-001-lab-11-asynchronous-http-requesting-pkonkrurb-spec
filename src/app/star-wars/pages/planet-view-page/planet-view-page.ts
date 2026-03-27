import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ModuleRoute } from '../../tokens';
import { planetsResource } from '../../helpers';
import { PlanetsView } from '../../components/planet-view/planet-view';
import { Location } from '@angular/common';

@Component({
  selector: 'app-planet-view-page',
  imports: [PlanetsView],
  templateUrl: './planet-view-page.html',
  styleUrl: './planet-view-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanetViewPage {
  readonly id = input.required<string>();

  protected readonly moduleRoute = inject(ModuleRoute);

  readonly dataResource = planetsResource(() => this.id());
private readonly location = inject(Location); // inject service เข้ามา

 protected goBack(): void {
    this.location.back();
  }
}
