import { InjectionToken } from '@angular/core';

export interface OauthClientConfiguration {
  readonly name: string;
  readonly id: string;
  readonly secret?: string;
  readonly tokenUrl: string;
  readonly authorizationUrl: string;
  readonly redirectUrl: string;
  readonly codeVerifierLength?: number;
}

export const OAUTH_CLIENT_CONFIGURATION = new InjectionToken<OauthClientConfiguration>(
  'oauth-configuration',
);

export interface AccessTokenData {
  readonly accessToken: string;
  readonly expiresIn: number;
  readonly tokeyType: string;
  readonly scope: string;
}

export interface AuthorizationHeaders {
  readonly Authorization: string;
}

export interface IdTokenClaims {
  // Standard OIDC Claims
  readonly iss: string; // Issuer Identifier
  readonly sub: string; // Subject Identifier (unique user ID)
  readonly aud: string | readonly string[]; // Audience
  readonly exp: number; // Expiration Time (Unix timestamp)
  readonly iat: number; // Issued At
  readonly auth_time?: number; // Authentication Time

  // Profile Claims
  readonly email?: string;
  readonly email_verified?: boolean;
  readonly name?: string;
  readonly given_name?: string;
  readonly family_name?: string;
  readonly picture?: string;
}
