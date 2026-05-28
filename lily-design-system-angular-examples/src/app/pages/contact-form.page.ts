import { Component, ChangeDetectionStrategy, signal, computed } from "@angular/core";
import { Form, Field, Label, TextInput, EmailInput, TextAreaInput, Button } from "lily-design-system-angular-headless";

@Component({
  selector: "lily-contact-form",
  standalone: true,
  imports: [Form, Field, Label, TextInput, EmailInput, TextAreaInput, Button],
  template: `
    <article class="page-wrapper">
      <h1>Contact Form</h1>

      <form (submit)="submit($event)" novalidate>
        <lily-field>
          <lily-label>Full name</lily-label>
          <lily-text-input label="Full name" [(value)]="name" />
        </lily-field>

        <lily-field>
          <lily-label>Email address</lily-label>
          <lily-email-input label="Email address" [(value)]="email" />
        </lily-field>

        <lily-field>
          <lily-label>Message</lily-label>
          <lily-text-area-input label="Message" [(value)]="message" />
        </lily-field>

        <lily-button>Send</lily-button>
      </form>

      @if (submitted()) {
        <p role="status">Thanks — we'll be in touch about "{{ subjectLine() }}".</p>
      }
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ContactFormPage {
  protected name = signal("");
  protected email = signal("");
  protected message = signal("");
  protected submitted = signal(false);

  protected subjectLine = computed(() =>
    this.message().slice(0, 60) || "(no message)",
  );

  protected submit(event: Event): void {
    event.preventDefault();
    this.submitted.set(true);
  }
}
