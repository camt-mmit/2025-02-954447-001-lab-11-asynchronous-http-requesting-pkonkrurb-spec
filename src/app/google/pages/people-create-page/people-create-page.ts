import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormField, form, submit } from '@angular/forms/signals';
import { createNavigateBack } from '../../helper';
import { PeopleService } from '../../services/people';

interface EmailEntry { type: string; value: string; }
interface PhoneEntry { type: string; value: string; }

@Component({
  selector: 'app-people-create-page',
  imports: [FormField],
  templateUrl: './people-create-page.html',
  styleUrl: './people-create-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeopleCreatePage {
  private readonly service = inject(PeopleService);
  protected readonly navigateBack = createNavigateBack();

  protected readonly emails = signal<EmailEntry[]>([{ type: 'home', value: '' }]);
  protected readonly phones = signal<PhoneEntry[]>([{ type: 'home', value: '' }]);

  protected readonly fieldTree = form(
    signal({ givenName: '', familyName: '' } as const),
  );

  protected addEmail(): void {
    this.emails.update((list) => [...list, { type: 'home', value: '' }]);
  }

  protected removeEmail(index: number): void {
    this.emails.update((list) => list.filter((_, i) => i !== index));
  }

  protected updateEmail(index: number, field: 'type' | 'value', val: string): void {
    this.emails.update((list) =>
      list.map((e, i) => (i === index ? { ...e, [field]: val } : e)),
    );
  }

  protected addPhone(): void {
    this.phones.update((list) => [...list, { type: 'home', value: '' }]);
  }

  protected removePhone(index: number): void {
    this.phones.update((list) => list.filter((_, i) => i !== index));
  }

  protected updatePhone(index: number, field: 'type' | 'value', val: string): void {
    this.phones.update((list) =>
      list.map((p, i) => (i === index ? { ...p, [field]: val } : p)),
    );
  }

  protected async save(): Promise<void> {
    await submit(this.fieldTree, async (fieldTree) => {
      const { givenName, familyName } = fieldTree().value();

      const validEmails = this.emails()
        .filter((e) => e.value.trim())
        .map((e) => ({ type: e.type, value: e.value.trim() }));

      const validPhones = this.phones()
        .filter((p) => p.value.trim())
        .map((p) => ({ type: p.type, value: p.value.trim() }));

      await this.service.createContact({
        names: [{ givenName: givenName.trim(), familyName: familyName.trim() }],
        ...(validEmails.length > 0 ? { emailAddresses: validEmails } : {}),
        ...(validPhones.length > 0 ? { phoneNumbers: validPhones } : {}),
      });
    });

    if (this.fieldTree().valid()) {
      this.navigateBack();
    }
  }

  protected cancel(): void {
    this.navigateBack();
  }
}
