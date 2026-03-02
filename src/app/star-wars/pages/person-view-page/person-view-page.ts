import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { PersonView } from '../../components/person-view/person-view';
import { personResource } from '../../helpers';
import { ModuleActivatedRoute } from '../../tokens';

@Component({
  selector: 'app-person-view-page',
  imports: [PersonView],
  templateUrl: './person-view-page.html',
  styleUrl: './person-view-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonViewPage {
  readonly id = input.required<string>();

  protected moduleRoute = inject(ModuleActivatedRoute);

  protected readonly resource = personResource(this.id).asReadonly();

  private readonly location = inject(Location);

  protected goBack(): void {
    this.location.back();
  }
}
