import { httpResource } from '@angular/common/http';
import { films, Planet, Person, ResultsList } from '../types';

/**
 * ฟังก์ชันพื้นฐานสำหรับดึงข้อมูล (Low-level fetch)
 * รองรับการทำ Generic <T> เพื่อระบุประเภทข้อมูลที่ต้องการ
 * @param url ที่อยู่ API
 * @param abortSignal ตัวสัญญาณสำหรับยกเลิกคำขอ (ป้องกัน Memory Leak)
 */
export async function fetchResource<T>(url: string, abortSignal?: AbortSignal | null): Promise<T>;
export async function fetchResource<T>(
  url: string | null,
  abortSignal?: AbortSignal | null,
): Promise<T | null>;

export async function fetchResource<T>(
  url: string | null,
  abortSignal: AbortSignal | null = null,
): Promise<T | null> {
  // ถ้าไม่มี URL ให้คืนค่า null ทันที ไม่ต้องยิง request
  if (url == null) {
    return null;
  }

  // ใช้ fetch มาตรฐานของ Browser ในการดึงข้อมูลแบบ Async
  const res = await fetch(url, { signal: abortSignal });

  return await res.json();
}

// URL หลักของ Star Wars API
const entryPointURL = 'https://swapi.dev/api';

/**
 * โครงสร้าง Parameter สำหรับการค้นหาและเปลี่ยนหน้า
 */
export interface ResultsListParams {
  readonly search?: string; // คำค้นหา
  readonly page?: string;   // เลขหน้า (Pagination)
}

/**
 * [ดึงรายการตัวละคร]
 * ส่งคืน httpResource ที่จะอัปเดตข้อมูลอัตโนมัติเมื่อ params() เปลี่ยนแปลง
 */
export function peopleListResource(params: () => ResultsListParams) {
  return httpResource<ResultsList<Person>>(() => ({
    url: `${entryPointURL}/people`,
    params: { ...params() },
  }));
}

/**
 * [ดึงข้อมูลตัวละครรายบุคคล]
 * @param id ฟังก์ชันที่ส่งคืน ID ของตัวละคร
 */
export function personResource(id: () => string) {
  return httpResource<Person>(() => `${entryPointURL}/people/${id()}`);
}

/**
 * [ดึงรายการดาวเคราะห์]
 * จะทำงานเฉพาะเมื่อมีการส่ง params เข้ามาเท่านั้น
 */
export function planetsListResource(params: () => ResultsListParams | undefined) {
  return httpResource<ResultsList<Planet>>(() =>
    params()
      ? {
          url: `${entryPointURL}/planets`,
          params: { ...params()! },
        }
      : undefined,
  );
}

/**
 * [ดึงข้อมูลดาวเคราะห์รายดวง]
 */
export function planetsResource(id: () => string | undefined) {
  return httpResource<Planet>(() => (id() ? `${entryPointURL}/planets/${id()!}` : undefined));
}

/**
 * [ดึงรายการภาพยนตร์ทั้งหมด]
 */
export function filmListResource(params: () => ResultsListParams | undefined) {
  return httpResource<ResultsList<films>>(() =>
    params()
      ? {
          url: `${entryPointURL}/films`,
          params: { ...params()! },
        }
      : undefined,
  );
}

/**
 * [ดึงข้อมูลภาพยนตร์รายเรื่อง]
 */
export function filmResource(id: () => string | undefined) {
  return httpResource<films>(() => (id() ? `${entryPointURL}/films/${id()!}` : undefined));
}
