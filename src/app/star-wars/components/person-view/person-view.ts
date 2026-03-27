import { AsyncPipe, DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  Resource,
  computed,
  effect,
  input,
  linkedSignal,
  resource,
} from '@angular/core';
import {
  FieldContext,
  applyEach,
  createManagedMetadataKey,
  form,
  metadata,
} from '@angular/forms/signals';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { fetchResource } from '../../helpers';
import { ExtractIdPipe } from '../../pipes/extract-id-pipe';
import { films, Person, Planet } from '../../types';

@Component({
  selector: 'app-person-view',
  imports: [RouterLink, AsyncPipe, DatePipe, ExtractIdPipe],
  templateUrl: './person-view.html',
  styleUrl: './person-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonView {
  readonly data = input.required<Person>();
  readonly moduleRoute = input.required<ActivatedRoute>();

/**
   * ข้อมูลแบบ Observable/Promise
   * ใช้ computed เพื่อสร้าง object ที่เก็บผลลัพธ์การดึงข้อมูลดาว (homeworld)
   * และรายการหนัง (films) โดยเรียกใช้ helper fetchResource
   */
  protected readonly asyncData = computed(() => {
    const { homeworld, films } = this.data();

    return {
      homeworld$: fetchResource<Planet>(homeworld),
      films: films.map((url) => fetchResource<films>(url)),
    } as const;
  });

/**
   * ทรัพยากรข้อมูลดาวบ้านเกิด (Homeworld)
   * ใช้ httpResource (Angular 19+) เพื่อดึงข้อมูล Planet จาก URL อัตโนมัติ
   * เมื่อค่า homeworld ใน data เปลี่ยนแปลง
   */
  protected readonly homeworldResource = httpResource<Planet>(
    () => this.data().homeworld ?? undefined,
  ).asReadonly();
/**
   * ทรัพยากรรายการภาพยนตร์ (Films List)**/

  protected readonly filmsResource = resource({
    params: () => this.data().films,
    loader: async ({ params, abortSignal }) =>
      await Promise.all(params.map(async (url) => await fetchResource<films>(url, abortSignal))),
  }).asReadonly();
/**
   * กุญแจสำหรับจัดการ Metadata ของหนังแต่ละเรื่อง**/

  protected readonly filmResourceKey = createManagedMetadataKey<
    Resource<films | undefined>,
    FieldContext<string>
  >((ctx) => {
    const resource = httpResource<films>(() => ctx()!.value());

    const guardEffectRef = effect((onCleanup) => {
      ctx()!.fieldTree();

      onCleanup(() => {
        guardEffectRef.destroy();
        resource.destroy();
      });
    });

    return resource.asReadonly();
  });
/**
   * ฟอร์มรายการภาพยนตร์ (Dynamic Films Form)
   * ใช้ form() ร่วมกับ linkedSignal เพื่อซิงค์ข้อมูลหนังจาก Input
   * และมีการใช้ applyEach เพื่อผูก filmResourceKey เข้ากับหนังทุกเรื่องในรายการ
   */
  protected readonly filmsForm = form(
    linkedSignal(() => this.data().films),
    (path) => {
      applyEach(path, (eachPath) => {
        metadata(eachPath, this.filmResourceKey, (ctx) => ctx);
      });
    },
  );
}
