import { ChangeDetectionStrategy, Component, effect, input, Resource, resource } from '@angular/core';
import { Film, Person, Planet } from '../../types';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { fetchResource } from '../../helpers';
import { createManagedMetadataKey, FieldContext } from '@angular/forms/signals';
import { httpResource } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { ExtractIdPipe } from '../../pipes/extract-id-pipe';

@Component({
  selector: 'app-planet-view',
  imports: [RouterLink, DatePipe, ExtractIdPipe],
  templateUrl: './planet-view.html',
  styleUrl: './planet-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanetView {
  readonly data = input.required<Planet>();
  readonly moduleRoute = input.required<ActivatedRoute>();

  protected readonly residentsResource = resource({
    params: () => this.data().residents,
    loader: async ({ params, abortSignal }) =>
      await Promise.all(params.map(async (url) => await fetchResource<Person>(url, abortSignal))),
  }).asReadonly();

    protected readonly residentsResourceKey = createManagedMetadataKey<
    Resource<Person | undefined>,
    FieldContext<string>
    // memmory leak is possible if the field is removed from the form, but in this case we know that it won't happen
  >((ctx) => {
    const resource = httpResource<Person>(() => ctx()!.value());

    const guardEffectRef = effect((onCleanup) => {
      ctx()!.fieldTree();

      onCleanup(() => {
        guardEffectRef.destroy();
        resource.destroy();
      });
    });

    return resource.asReadonly();
  });

  protected readonly filmsResource = resource({
    params: () => this.data().films,
    loader: async ({ params, abortSignal }) =>
      await Promise.all(params.map(async (url) => await fetchResource<Film>(url, abortSignal))),
  }).asReadonly();

  protected readonly filmsResourceKey = createManagedMetadataKey<
    Resource<Film | undefined>,
    FieldContext<string>
    // memmory leak is possible if the field is removed from the form, but in this case we know that it won't happen
  >((ctx) => {
    const resource = httpResource<Film>(() => ctx()!.value());

    const guardEffectRef = effect((onCleanup) => {
      ctx()!.fieldTree();

      onCleanup(() => {
        guardEffectRef.destroy();
        resource.destroy();
      });
    });

    return resource.asReadonly();
  });

}
