import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, ResourceRef, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { defer, firstValueFrom, switchMap } from 'rxjs';
import { OauthClient } from './oauth.client';

const apiUrl = 'https://people.googleapis.com/v1';

export interface PersonName {
  givenName?: string;
  familyName?: string;
  displayName?: string;
}

export interface PersonEmail {
  type?: string;
  value?: string;
}

export interface PersonPhone {
  type?: string;
  value?: string;
}

export interface PersonPhoto {
  url?: string;
  default?: boolean;
}

export interface Person {
  resourceName?: string;
  etag?: string;
  names?: PersonName[];
  emailAddresses?: PersonEmail[];
  phoneNumbers?: PersonPhone[];
  photos?: PersonPhoto[];
}

export interface ConnectionsResponse {
  connections?: Person[];
  totalPeople?: number;
  nextPageToken?: string;
}

export interface CreateContactBody {
  names?: PersonName[];
  emailAddresses?: PersonEmail[];
  phoneNumbers?: PersonPhone[];
}

@Injectable({
  providedIn: 'root',
})
export class PeopleService {
private readonly baseUrl = 'https://people.googleapis.com/v1';
  private readonly oauthClient = inject(OauthClient);
  private readonly http = inject(HttpClient);

  connectionsResource(): ResourceRef<ConnectionsResponse | undefined> {
    return rxResource({
      stream: () =>
        defer(async () => ({
          ...(await this.oauthClient.getAuthorizationHeaders()),
        })).pipe(
          switchMap((headers) =>
            this.http.get<ConnectionsResponse>(`${apiUrl}/people/me/connections`, {
              params: new HttpParams({
                fromObject: {
                  personFields: 'names,emailAddresses,phoneNumbers,photos',
                  pageSize: '1000',
                },
              }),
              headers,
            }),
          ),
        ),
    });
  }

  createContact(body: CreateContactBody): Promise<Person> {
    return firstValueFrom(
      defer(async () => ({
        ...(await this.oauthClient.getAuthorizationHeaders()),
      })).pipe(
        switchMap((headers) =>
          this.http.post<Person>(`${apiUrl}/people:createContact`, body, {
            params: new HttpParams({
              fromObject: { personFields: 'names,emailAddresses,phoneNumbers' },
            }),
            headers,
          }),
        ),
      ),
    );
  }
}
