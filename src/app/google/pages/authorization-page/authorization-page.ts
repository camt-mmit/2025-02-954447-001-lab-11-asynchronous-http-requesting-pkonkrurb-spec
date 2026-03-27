import { ChangeDetectionStrategy, Component, OnInit, inject, input, signal } from '@angular/core';
import { OauthClient } from '../../services/oauth.client';

@Component({
  selector: 'app-authorization-page',
  imports: [],
  templateUrl: './authorization-page.html',
  styleUrl: './authorization-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorizationPage implements OnInit {
  readonly state = input<string>();
  readonly code = input<string>();
  readonly error = input<string>();
  readonly error_description = input<string>();

  protected errorMessage = signal<string | null>(null);

  private readonly oauthClient = inject(OauthClient);

  async ngOnInit(): Promise<void> {
    if (typeof this.error() !== 'undefined') {
      this.errorMessage.set(
        `${this.error()!}${this.error_description() ? `: ${this.error_description()!}` : ''}`,
      );
      return;
    }

    const stateCode = this.state();
    const code = this.code();

    if (stateCode && code) {
      try {
        await this.oauthClient.exchangeAuthorizationCode(this.state()!, this.code()!);
      } catch (error) {
        console.error(error);
        this.errorMessage.set(`${error}`);
      }
    } else {
      this.errorMessage.set(`invalid_response: no state or code in query parameters`);
    }
  }
}
