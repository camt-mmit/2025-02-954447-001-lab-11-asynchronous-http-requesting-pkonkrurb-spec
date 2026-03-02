import { httpResource } from '@angular/common/http';
import { Film, Person, Planet, ResultsList } from '../types';

export async function fetchResource<T>(url: string, abortSignal?: AbortSignal | null): Promise<T>;
export async function fetchResource<T>(
  url: string | null,
  abortSignal?: AbortSignal | null,
): Promise<T | null>;

export async function fetchResource<T>(
  url: string | null,
  abortSignal: AbortSignal | null = null,
): Promise<T | null> {
  if (url == null) {
    return null;
  }

  const res = await fetch(url, { signal: abortSignal , cache : 'force-cache' });

  return await res.json();
}

const entryPointURL = 'https://swapi.dev/api';

export interface ResultsListParams {
  readonly search?: string;
  readonly page?: string;
}

export function peopleListResource(params: () => ResultsListParams) {
  return httpResource<ResultsList<Person>>(() => ({
    url: `${entryPointURL}/people`,
    params: { ...params() },
  }));
}

export function personResource(id: () => string) {
  return httpResource<Person>(() => `${entryPointURL}/people/${id()}`);
}

export function filmsListResource(params: () => ResultsListParams) {
  return httpResource<ResultsList<Film>>(() => ({
    url: `${entryPointURL}/films`,
    params: { ...params() },
  }));
}

export function filmResource(id: () => string) {
  return httpResource<Film>(() => `${entryPointURL}/films/${id()}`);
}

export function planetsListResource(params: () => ResultsListParams) {
  return httpResource<ResultsList<Planet>>(() => ({
    url: `${entryPointURL}/planets`,
    params: { ...params() },
  }));
}

export function planetResource(id: () => string) {
  return httpResource<Planet>(() => `${entryPointURL}/planets/${id()}`);
}
