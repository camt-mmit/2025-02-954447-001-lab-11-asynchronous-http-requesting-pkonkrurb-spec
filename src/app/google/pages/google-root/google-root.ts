import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { OauthClient } from '../../services/oauth.client';

@Component({
  selector: 'app-google-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './google-root.html',
  styleUrl: './google-root.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoogleRoot {
  private readonly oauthClient = inject(OauthClient);

  protected readonly accessTokenData = this.oauthClient.accessTokenDataResource();

  protected readonly idTokenClaims = this.oauthClient.idTokenClaimsResource();

   protected async signIn(): Promise<void> {
    const url = await this.oauthClient.getAuthorizationCodeUrl(
      [
        'openid',
        'profile',
        'email',
        'https://www.googleapis.com/auth/calendar.events',
        'https://www.googleapis.com/auth/contacts',
      ],
      {
        prompt: 'consent',
        access_type: 'offline',
      },
    );

    location.href = `${url}`;
  }

  protected async signOut(): Promise<void> {
    await this.oauthClient.clearTokens();
  }
}
