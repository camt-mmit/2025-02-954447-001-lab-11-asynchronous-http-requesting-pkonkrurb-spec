import { ChangeDetectionStrategy, Component,  effect, input, Resource, resource } from '@angular/core';
import { ExtractIdPipe } from '../../pipes/extract-id-pipe';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Film, Person, Planet } from '../../types';
import { fetchResource } from '../../helpers';
import { httpResource } from '@angular/common/http';
import { createManagedMetadataKey, FieldContext } from '@angular/forms/signals';

@Component({
  selector: 'app-film-view',
  imports: [RouterLink, DatePipe, ExtractIdPipe],
  templateUrl: './film-view.html',
  styleUrl: './film-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilmView {
  readonly data = input.required<Film>();
  readonly moduleRoute = input.required<ActivatedRoute>();

  protected readonly charactersResource = resource({
    params: () => this.data().characters,
    loader: async ({ params, abortSignal }) =>
      await Promise.all(params.map(async (url) => await fetchResource<Person>(url, abortSignal))),
  }).asReadonly();

    protected readonly charactersResourceKey = createManagedMetadataKey<
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

  protected readonly planetsResource = resource({
    params: () => this.data().planets,
    loader: async ({ params, abortSignal }) =>
      await Promise.all(params.map(async (url) => await fetchResource<Planet>(url, abortSignal))),
  }).asReadonly();

  protected readonly planetsResourceKey = createManagedMetadataKey<
    Resource<Planet | undefined>,
    FieldContext<string>
    // memmory leak is possible if the field is removed from the form, but in this case we know that it won't happen
  >((ctx) => {
    const resource = httpResource<Planet>(() => ctx()!.value());

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
