import { Routes } from '@angular/router';
import { googleOauthConfig } from './config';
import { formDirtyComfirmation } from './helper';
import { AuthorizationPage } from './pages/authorization-page/authorization-page';
import { EventInsertPage } from './pages/event-insert-page/event-insert-page';
import { EventsListPage } from './pages/events-list-page/events-list-page';
import { GoogleRoot } from './pages/google-root/google-root';
import { PeopleCreatePage } from './pages/people-create-page/people-create-page';
import { PeopleListPage } from './pages/people-list-page/people-list-page';
import { FormPage } from './pages/types';
import { CalendarService } from './services/calendar.service';
import { OauthClient } from './services/oauth.client';
import { PeopleService } from './services/people';
import { OAUTH_CLIENT_CONFIGURATION } from './types/services';

export default [
  {
    path: '',
    providers: [
      { provide: OAUTH_CLIENT_CONFIGURATION, useValue: googleOauthConfig },
      OauthClient,
      CalendarService,
      PeopleService,
    ],
    children: [
      { path: 'authorization', data: { fullPage: true }, component: AuthorizationPage },

      {
        path: '',
        component: GoogleRoot,
        children: [
          { path: '', redirectTo: 'events', pathMatch: 'full' },

          {
            path: 'events',
            children: [
              { path: '', component: EventsListPage },
              {
                path: 'insert',
                canDeactivate: [
                  (component: Partial<FormPage>) => {
                    if (component.dirty?.() ?? true) {
                      return formDirtyComfirmation();
                    } else {
                      return true;
                    }
                  },
                ],
                component: EventInsertPage,
              },
            ],
          },

          // ✅ people อยู่ตรงนี้ — ระดับเดียวกับ events
          {
            path: 'people',
            children: [
              { path: '', component: PeopleListPage },
              { path: 'create', component: PeopleCreatePage },
            ],
          },
        ],
      },
    ],
  },
] as Routes;
