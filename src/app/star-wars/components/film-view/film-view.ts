import { ChangeDetectionStrategy, Component,  input, resource } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ExtractIdPipe } from '../../pipes/extract-id-pipe';
import { films, Person, Planet } from '../../types';
import { fetchResource } from '../../helpers';

@Component({
  selector: 'app-film-view',
  standalone: true,
  imports: [RouterLink, ExtractIdPipe, DatePipe],
  templateUrl: './film-view.html',
  styleUrl: './film-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilmView {
  readonly data = input.required<films>();

  // ดึงข้อมูลตัวละคร (Characters) ทั้งหมดในเรื่อง [cite: 48, 57]
  protected readonly charactersResource = resource({
    params: () => this.data().characters,
    loader: async ({ params, abortSignal }) => {
      if (!params || params.length === 0) return [];
      return await Promise.all(
        params.map(async (url) => await fetchResource<Person>(url, abortSignal))
      );
    },
  }).asReadonly();

  // ดึงข้อมูลดาวเคราะห์ (Planets) ที่ปรากฏในเรื่อง [cite: 67, 76]
  protected readonly planetsResource = resource({
    params: () => this.data().planets,
    loader: async ({ params, abortSignal }) => {
      if (!params || params.length === 0) return [];
      return await Promise.all(
        params.map(async (url) => await fetchResource<Planet>(url, abortSignal))
      );
    },
  }).asReadonly();
}
