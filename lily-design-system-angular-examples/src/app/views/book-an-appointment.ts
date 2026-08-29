import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  signal,
  inject,
} from "@angular/core";
import { BackLink } from "../components/BackLink";
import { WarningCallout } from "../components/WarningCallout";
import { InsetText } from "../components/InsetText";
import { Details } from "../components/Details";
import { Button } from "../components/Button";
import { Field } from "../components/Field";
import { Fieldset } from "../components/Fieldset";
import { Label } from "../components/Label";
import { Hint } from "../components/Hint";
import { TextAreaInput } from "../components/TextAreaInput";
import { CharacterCounter } from "../components/CharacterCounter";
import { DateInput } from "../components/DateInput";
import { Select } from "../components/Select";
import { Option } from "../components/Option";
import { TextInput } from "../components/TextInput";
import { EmailInput } from "../components/EmailInput";
import { TelInput } from "../components/TelInput";
import { ErrorSummary } from "../components/ErrorSummary";
import { ErrorMessage } from "../components/ErrorMessage";
import { StatusTag } from "../components/StatusTag";
import { SuccessPanel } from "../components/SuccessPanel";
import { Panel } from "../components/Panel";

// Book an appointment -- Lily's flagship composed-page pattern (plan
// P6-T2), ported to Angular (plan P6-T3). A multi-step GP-appointment
// booking wizard: reason, date and time, your details, check your
// answers, confirmation. Canonical reference:
// lily-design-system-svelte-sveltekit-examples/src/routes/book-an-appointment/+page.svelte
// Full write-up: docs/patterns/book-an-appointment.md.
//
// This Angular port trusts this app's own headless component sources
// rather than assuming the Svelte components' prop shapes carry over.
// Several of this catalog's components are thin wrapper divs around a
// native element -- Angular's component-selector host tag wraps the
// rendered template (the same "wrapper-host" issue documented in
// spec/index.md §11.8 for list/table components) -- which has real
// consequences followed throughout this file:
//
//   1. Static/bound attributes this catalog's components don't declare
//      as @Input()s (id, tabindex, role, aria-live) land on the OUTER
//      host tag (<lily-x>), not on the native element the component
//      renders internally. That's harmless -- and useful, see the
//      error summary's id/tabindex/role below -- as long as the
//      consumer only needs SOME element at that id (`focusField()`
//      below descends into the first focusable native descendant
//      rather than assuming the id itself is focusable), but it rules
//      out `<label for>` linkage to a specific wrapped input.
//   2. RadioInput and CheckboxInput expose only a string `value` model
//      (mirrored onto the native `value` attribute) with no `checked`
//      model and no `name` input, so they cannot form a real mutually
//      exclusive native radio group or track a real boolean toggle.
//      RadioGroup renders a bare `<div>` with no `role`. Following the
//      direct-class-hook-markup workaround this app already uses for
//      wrapper-host list structures (see page-layout.ts,
//      timeline-and-cards.ts, task-management.ts), the reason radios,
//      their group, and the two checkboxes in this file are plain
//      native HTML carrying the same class hooks (`radio-group`,
//      `radio-input`, `checkbox-input`) rather than the
//      <lily-radio-group>/<lily-radio-input>/<lily-checkbox-input>
//      components -- the class hook is the contract, and plain
//      semantic HTML is the correct consumption when the wrapper
//      can't do the job. Each is wrapped in a real native
//      <label class="label"> (not the <lily-label> component, which
//      renders a decorative <div> with no `for` association) so
//      clicking the visible text toggles the control, matching the
//      reference's "Label wraps the control" pattern in spirit.
//   3. StepList/StepListItem and SummaryList/SummaryListItem have the
//      same <ol>/<li> wrapper-host problem as BreadcrumbList and
//      TimelineList (an Angular <lily-step-list-item> host sits
//      between the rendered <ol> and its rendered <li>, breaking the
//      list/listitem parent-child structure axe requires), so both
//      also use direct class-hook markup.
//   4. Button always renders `type="button"` (never `type="submit"`),
//      so clicking it can never trigger a form's native submit event --
//      each step's (click) handler calls the validate-and-advance
//      method directly. The one native path that *can* still reach a
//      submit event is pressing Enter in a lone text-like field, so
//      every <form> still carries `novalidate` plus a matching
//      (ngSubmit) handler defensively, following the pattern doc's
//      "novalidate is required alongside a custom error summary" rule
//      to the letter. Tested for real, though, this app's shape
//      doesn't actually reproduce the original bug: with no submit
//      button in the form at all, Chromium's implicit Enter-submission
//      on step 2's empty required date field fired the `submit` event
//      (and this page's own validation) regardless of `novalidate` --
//      removing it made no observable difference, because there was no
//      native submit-button-driven constraint-validation gate to
//      bypass in the first place. `novalidate` is kept anyway: it is
//      correct per the pattern doc's rule, harmless, and future-proofs
//      against a Button fix that adds a real `type="submit"`.

type Step = 0 | 1 | 2 | 3 | 4 | 5;
type Reason = "" | "routine" | "follow-up" | "vaccination" | "other";
type TimeOfDay = "" | "morning" | "afternoon" | "evening";
type StepStatus = "waiting" | "in-progress" | "finished";

const REASON_LABELS: Record<string, string> = {
  routine: "Routine check-up",
  "follow-up": "Follow-up appointment",
  vaccination: "Vaccination",
  other: "Something else",
};

const TIME_LABELS: Record<string, string> = {
  morning: "Morning (8am to 12pm)",
  afternoon: "Afternoon (12pm to 4pm)",
  evening: "Evening (4pm to 6pm)",
};

const STATUS_TEXT: Record<StepStatus, string> = {
  waiting: "not started",
  "in-progress": "current step",
  finished: "completed",
};

// Fixed rendering order for the error summary -- not object insertion
// order, which the validate* methods don't guarantee. Each key is also
// the DOM id `focusField()` jumps to.
const FIELD_ORDER: readonly string[] = [
  "reason",
  "reasonOther",
  "appointmentDate",
  "appointmentTime",
  "fullName",
  "email",
  "confirmedAccurate",
];

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

@Component({
  selector: "lily-book-an-appointment",
  standalone: true,
  imports: [
    BackLink,
    WarningCallout,
    InsetText,
    Details,
    Button,
    Field,
    Fieldset,
    Label,
    Hint,
    TextAreaInput,
    CharacterCounter,
    DateInput,
    Select,
    Option,
    TextInput,
    EmailInput,
    TelInput,
    ErrorSummary,
    ErrorMessage,
    StatusTag,
    SuccessPanel,
    Panel,
  ],
  template: `
    <article class="page-wrapper">
      <lily-back-link href="/">Back to examples</lily-back-link>

      <h1>Book an appointment</h1>

      @if (step() >= 1 && step() <= 4) {
        <!-- Direct class-hook markup: the element-selector wrapper hosts
             break the required ol>li structure axe requires; see
             page-layout.ts / timeline-and-cards.ts for the established
             workaround this file follows. -->
        <ol class="step-list" aria-label="Booking progress">
          <li
            class="step-list-item"
            [attr.aria-current]="step() === 1 ? 'step' : null"
            [attr.data-status]="statusFor(1)"
          >
            Reason<span class="visually-hidden"> ({{ statusText(statusFor(1)) }})</span>
          </li>
          <li
            class="step-list-item"
            [attr.aria-current]="step() === 2 ? 'step' : null"
            [attr.data-status]="statusFor(2)"
          >
            Date and time<span class="visually-hidden"> ({{ statusText(statusFor(2)) }})</span>
          </li>
          <li
            class="step-list-item"
            [attr.aria-current]="step() === 3 ? 'step' : null"
            [attr.data-status]="statusFor(3)"
          >
            Your details<span class="visually-hidden"> ({{ statusText(statusFor(3)) }})</span>
          </li>
          <li
            class="step-list-item"
            [attr.aria-current]="step() === 4 ? 'step' : null"
            [attr.data-status]="statusFor(4)"
          >
            Check your answers<span class="visually-hidden"> ({{ statusText(statusFor(4)) }})</span>
          </li>
        </ol>
      }

      @if (errorList().length > 0) {
        <lily-error-summary id="booking-error-summary" tabindex="-1" role="alert">
          <p><strong>There is a problem</strong></p>
          <ul>
            @for (e of errorList(); track e.key) {
              <li><a [href]="'#' + e.key" (click)="focusField(e.key, $event)">{{ e.message }}</a></li>
            }
          </ul>
        </lily-error-summary>
      }

      @switch (step()) {
        @case (0) {
          <h2 id="step-heading" tabindex="-1">Before you start</h2>

          <lily-warning-callout label="Emergency notice">
            <p>If you have a medical emergency, call 999 or go to your nearest A&amp;E.</p>
          </lily-warning-callout>

          <p>
            Use this service to book a routine appointment with your GP surgery
            online. It takes about 5 minutes.
          </p>

          <lily-inset-text>
            Appointments are available Monday to Friday, 8am to 6pm. Most requests
            are confirmed within 2 working days.
          </lily-inset-text>

          <lily-details label="What happens at your appointment">
            <p><strong>What happens at your appointment</strong></p>
            <p>
              A clinician will review the reason you gave for the appointment and
              may ask follow-up questions. Bring a list of any medicines you are
              currently taking.
            </p>
          </lily-details>

          <p><lily-button (click)="goToStep(1)">Start now</lily-button></p>
        }
        @case (1) {
          <h2 id="step-heading" tabindex="-1">Reason for your appointment</h2>

          <form (ngSubmit)="submitReason($event)" novalidate>
            <div class="radio-group" role="radiogroup" aria-label="Why do you need an appointment?">
              <label class="label">
                <input
                  type="radio"
                  id="reason"
                  class="radio-input"
                  name="reason"
                  value="routine"
                  required
                  [checked]="reason() === 'routine'"
                  (change)="reason.set('routine')"
                  aria-label="Routine check-up"
                />
                {{ reasonLabels["routine"] }}
              </label>
              <label class="label">
                <input
                  type="radio"
                  class="radio-input"
                  name="reason"
                  value="follow-up"
                  [checked]="reason() === 'follow-up'"
                  (change)="reason.set('follow-up')"
                  aria-label="Follow-up appointment"
                />
                {{ reasonLabels["follow-up"] }}
              </label>
              <label class="label">
                <input
                  type="radio"
                  class="radio-input"
                  name="reason"
                  value="vaccination"
                  [checked]="reason() === 'vaccination'"
                  (change)="reason.set('vaccination')"
                  aria-label="Vaccination"
                />
                {{ reasonLabels["vaccination"] }}
              </label>
              <label class="label">
                <input
                  type="radio"
                  class="radio-input"
                  name="reason"
                  value="other"
                  [checked]="reason() === 'other'"
                  (change)="reason.set('other')"
                  aria-label="Something else"
                />
                {{ reasonLabels["other"] }}
              </label>
            </div>
            @if (errors()['reason']) {
              <lily-error-message>{{ errors()['reason'] }}</lily-error-message>
            }

            @if (reason() === 'other') {
              <lily-field>
                <lily-label>Tell us more</lily-label>
                <lily-text-area-input
                  id="reasonOther"
                  label="Tell us more about the reason for your appointment"
                  [(value)]="reasonOther"
                  [required]="true"
                />
              </lily-field>
              @if (errors()['reasonOther']) {
                <lily-error-message>{{ errors()['reasonOther'] }}</lily-error-message>
              }
              <lily-character-counter aria-live="polite">
                {{ reasonOther().length }}/250 characters used
              </lily-character-counter>
            }

            <p><lily-button (click)="submitReason($event)">Continue</lily-button></p>
          </form>
        }
        @case (2) {
          <h2 id="step-heading" tabindex="-1">Choose a date and time</h2>

          <lily-inset-text>Appointments are available Monday to Friday, 8am to 6pm.</lily-inset-text>

          <form (ngSubmit)="submitDateTime($event)" novalidate>
            <lily-fieldset label="Preferred date and time">
              <lily-field>
                <lily-label>Preferred date</lily-label>
                <lily-hint>We will try to match your preference, but availability may vary.</lily-hint>
                <lily-date-input id="appointmentDate" label="Preferred date" [(value)]="appointmentDate" [required]="true" />
              </lily-field>
              @if (errors()['appointmentDate']) {
                <lily-error-message>{{ errors()['appointmentDate'] }}</lily-error-message>
              }

              <lily-field>
                <lily-label>Preferred time of day</lily-label>
                <lily-select
                  id="appointmentTime"
                  label="Preferred time of day"
                  [value]="appointmentTime()"
                  (valueChange)="appointmentTime.set($any($event))"
                >
                  <lily-option value="">Select a time of day</lily-option>
                  <lily-option value="morning">{{ timeLabels["morning"] }}</lily-option>
                  <lily-option value="afternoon">{{ timeLabels["afternoon"] }}</lily-option>
                  <lily-option value="evening">{{ timeLabels["evening"] }}</lily-option>
                </lily-select>
              </lily-field>
              @if (errors()['appointmentTime']) {
                <lily-error-message>{{ errors()['appointmentTime'] }}</lily-error-message>
              }
            </lily-fieldset>

            <p style="display: flex; gap: var(--nhs-space-3);">
              <lily-button (click)="goBack(1)">Back</lily-button>
              <lily-button (click)="submitDateTime($event)">Continue</lily-button>
            </p>
          </form>
        }
        @case (3) {
          <h2 id="step-heading" tabindex="-1">Your details</h2>

          <form (ngSubmit)="submitDetails($event)" novalidate>
            <lily-field>
              <lily-label>Full name</lily-label>
              <lily-text-input id="fullName" label="Full name" [(value)]="fullName" [required]="true" />
            </lily-field>
            @if (errors()['fullName']) {
              <lily-error-message>{{ errors()['fullName'] }}</lily-error-message>
            }

            <lily-field>
              <lily-label>Email address</lily-label>
              <lily-hint>We will use this to send your confirmation.</lily-hint>
              <lily-email-input id="email" label="Email address" [(value)]="email" [required]="true" />
            </lily-field>
            @if (errors()['email']) {
              <lily-error-message>{{ errors()['email'] }}</lily-error-message>
            }

            <lily-field>
              <lily-label>Phone number</lily-label>
              <lily-hint>Optional — only needed if we must contact you about a change.</lily-hint>
              <lily-tel-input label="Phone number" [(value)]="phone" />
            </lily-field>

            <p>
              <label class="label">
                <input
                  type="checkbox"
                  class="checkbox-input"
                  [checked]="needsSupport()"
                  (change)="needsSupport.set($any($event.target).checked)"
                  aria-label="I need an interpreter or additional support"
                />
                I need an interpreter or additional support
              </label>
            </p>

            <p style="display: flex; gap: var(--nhs-space-3);">
              <lily-button (click)="goBack(2)">Back</lily-button>
              <lily-button (click)="submitDetails($event)">Continue</lily-button>
            </p>
          </form>
        }
        @case (4) {
          <h2 id="step-heading" tabindex="-1">Check your answers</h2>

          <!-- Direct class-hook markup: same ol>li wrapper-host issue as
               the step list above. -->
          <ol class="summary-list" aria-label="Your appointment details">
            <li class="summary-list-item">
              <span>Reason</span>
              <span>
                {{ reasonSummary() }}
                @if (reason() === 'other' && reasonOther()) {
                  <br /><span>{{ reasonOther() }}</span>
                }
              </span>
              <a href="#reason" (click)="goToStep(1, $event)">Change<span class="visually-hidden"> reason</span></a>
            </li>
            <li class="summary-list-item">
              <span>Date</span>
              <span>{{ appointmentDate() || "Not answered" }}</span>
              <a href="#date" (click)="goToStep(2, $event)">Change<span class="visually-hidden"> date</span></a>
            </li>
            <li class="summary-list-item">
              <span>Time of day</span>
              <span>{{ timeSummary() }}</span>
              <a href="#time" (click)="goToStep(2, $event)">Change<span class="visually-hidden"> time of day</span></a>
            </li>
            <li class="summary-list-item">
              <span>Full name</span>
              <span>{{ fullName() || "Not answered" }}</span>
              <a href="#name" (click)="goToStep(3, $event)">Change<span class="visually-hidden"> full name</span></a>
            </li>
            <li class="summary-list-item">
              <span>Email address</span>
              <span>{{ email() || "Not answered" }}</span>
              <a href="#email-review" (click)="goToStep(3, $event)">Change<span class="visually-hidden"> email address</span></a>
            </li>
            <li class="summary-list-item">
              <span>Phone number</span>
              <span>
                @if (phone()) {
                  {{ phone() }}
                } @else {
                  <lily-status-tag>Not provided</lily-status-tag>
                }
              </span>
              <a href="#phone-review" (click)="goToStep(3, $event)">Change<span class="visually-hidden"> phone number</span></a>
            </li>
            <li class="summary-list-item">
              <span>Interpreter or additional support</span>
              <span>{{ needsSupport() ? "Yes" : "No" }}</span>
              <a href="#support-review" (click)="goToStep(3, $event)"
                >Change<span class="visually-hidden"> interpreter or additional support</span></a
              >
            </li>
          </ol>

          <form (ngSubmit)="submitBooking($event)" novalidate>
            <p>
              <label class="label">
                <input
                  type="checkbox"
                  id="confirmedAccurate"
                  class="checkbox-input"
                  [checked]="confirmedAccurate()"
                  (change)="confirmedAccurate.set($any($event.target).checked)"
                  aria-label="I confirm the information above is correct"
                />
                I confirm the information above is correct
              </label>
              @if (errors()['confirmedAccurate']) {
                <lily-error-message>{{ errors()['confirmedAccurate'] }}</lily-error-message>
              }
            </p>

            <p style="display: flex; gap: var(--nhs-space-3);">
              <lily-button (click)="goBack(3)">Back</lily-button>
              <lily-button (click)="submitBooking($event)">Confirm and book</lily-button>
            </p>
          </form>
        }
        @case (5) {
          <h2 id="step-heading" tabindex="-1">Booking confirmed</h2>

          <lily-success-panel label="Booking confirmed">
            <p>
              Your appointment reference number is <strong>{{ referenceNumber() }}</strong>. We have
              sent a confirmation to {{ email() }}.
            </p>
          </lily-success-panel>

          <ol class="step-list" aria-label="Booking progress">
            <li class="step-list-item" data-status="finished">Reason<span class="visually-hidden"> (completed)</span></li>
            <li class="step-list-item" data-status="finished">Date and time<span class="visually-hidden"> (completed)</span></li>
            <li class="step-list-item" data-status="finished">Your details<span class="visually-hidden"> (completed)</span></li>
            <li class="step-list-item" data-status="finished">Check your answers<span class="visually-hidden"> (completed)</span></li>
          </ol>

          <lily-panel label="What happens next">
            <p>
              A member of the practice team will confirm your
              {{ appointmentTime() ? timeLabels[appointmentTime()].toLowerCase() : "" }} appointment on
              {{ appointmentDate() }} by email. Keep your reference number in case you need to change or
              cancel.
            </p>
          </lily-panel>

          <p><lily-button (click)="startOver()">Book another appointment</lily-button></p>
        }
      }
    </article>
  `,
  styles: [
    `
      .visually-hidden {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BookAnAppointmentPage {
  private readonly cdr = inject(ChangeDetectorRef);

  protected readonly reasonLabels = REASON_LABELS;
  protected readonly timeLabels = TIME_LABELS;
  private readonly today = todayIso();

  protected readonly step = signal<Step>(0);

  protected readonly reason = signal<Reason>("");
  protected readonly reasonOther = signal("");
  protected readonly appointmentDate = signal("");
  protected readonly appointmentTime = signal<TimeOfDay>("");
  protected readonly fullName = signal("");
  protected readonly email = signal("");
  protected readonly phone = signal("");
  protected readonly needsSupport = signal(false);
  protected readonly confirmedAccurate = signal(false);
  protected readonly referenceNumber = signal("");

  protected readonly errors = signal<Record<string, string>>({});

  protected errorList(): Array<{ key: string; message: string }> {
    const e = this.errors();
    return FIELD_ORDER.filter((key) => e[key]).map((key) => ({ key, message: e[key] }));
  }

  protected reasonSummary(): string {
    return this.reasonLabels[this.reason()] ?? "Not answered";
  }

  protected timeSummary(): string {
    const t = this.appointmentTime();
    return t ? this.timeLabels[t] : "Not answered";
  }

  protected statusFor(n: 1 | 2 | 3 | 4): StepStatus {
    const s = this.step();
    if (s >= 5) return "finished";
    if (n < s) return "finished";
    if (n === s) return "in-progress";
    return "waiting";
  }

  protected statusText(status: StepStatus): string {
    return STATUS_TEXT[status];
  }

  // Focus management on step change. A single-page wizard has no route
  // change for the browser or a screen reader to announce on its own, so
  // the page moves focus to the new step's own heading -- the Angular
  // equivalent of the outcome a real navigation gives elsewhere in this
  // app. `detectChanges()` runs the deferred @switch/@if render
  // synchronously first, the same "render first, focus second" ordering
  // documented in the angular-date-time-picker helper -- focusing into a
  // branch that hasn't rendered yet is a no-op in a real browser.
  private focusStepHeading(): void {
    this.cdr.detectChanges();
    document.getElementById("step-heading")?.focus();
  }

  // GOV.UK/NHS error-summary pattern: render the summary, then move focus
  // to it so screen reader and keyboard users land on the problem list
  // immediately rather than being left wherever they were.
  private focusErrorSummary(): void {
    this.cdr.detectChanges();
    document.getElementById("booking-error-summary")?.focus();
  }

  // Jumps from an error-summary link to the offending field. The target
  // id may sit on a real native input (the raw-markup radios/checkboxes)
  // or on a wrapper component's host tag (see file header, point 1) --
  // either way, focus the element itself if it's focusable, otherwise
  // the first focusable native control inside it.
  protected focusField(key: string, event: Event): void {
    event.preventDefault();
    const el = document.getElementById(key);
    if (!el) return;
    const selector = "input, select, textarea, button, a[href]";
    const target = el.matches(selector) ? el : el.querySelector<HTMLElement>(selector);
    target?.focus();
  }

  private validateReason(): boolean {
    const e: Record<string, string> = {};
    if (!this.reason()) e["reason"] = "Select a reason for your appointment";
    else if (this.reason() === "other" && !this.reasonOther().trim())
      e["reasonOther"] = "Enter details about your appointment";
    this.errors.set(e);
    return Object.keys(e).length === 0;
  }

  private validateDateTime(): boolean {
    const e: Record<string, string> = {};
    if (!this.appointmentDate()) e["appointmentDate"] = "Enter your preferred date";
    else if (this.appointmentDate() < this.today)
      e["appointmentDate"] = "Enter a date that is today or in the future";
    if (!this.appointmentTime()) e["appointmentTime"] = "Select a preferred time of day";
    this.errors.set(e);
    return Object.keys(e).length === 0;
  }

  private validateDetails(): boolean {
    const e: Record<string, string> = {};
    if (!this.fullName().trim()) e["fullName"] = "Enter your full name";
    if (!this.email().trim()) e["email"] = "Enter your email address";
    else if (!this.email().includes("@"))
      e["email"] = "Enter an email address in the correct format";
    this.errors.set(e);
    return Object.keys(e).length === 0;
  }

  private validateCheckAnswers(): boolean {
    const e: Record<string, string> = {};
    if (!this.confirmedAccurate())
      e["confirmedAccurate"] = "Confirm that the information above is correct";
    this.errors.set(e);
    return Object.keys(e).length === 0;
  }

  private goNext(validate: () => boolean, next: Step): void {
    if (validate()) {
      this.errors.set({});
      this.step.set(next);
      this.focusStepHeading();
    } else {
      this.focusErrorSummary();
    }
  }

  protected goBack(prev: Step): void {
    this.errors.set({});
    this.step.set(prev);
    this.focusStepHeading();
  }

  protected goToStep(n: Step, event?: Event): void {
    event?.preventDefault();
    this.errors.set({});
    this.step.set(n);
    this.focusStepHeading();
  }

  protected submitReason(event: Event): void {
    event.preventDefault();
    this.goNext(() => this.validateReason(), 2);
  }

  protected submitDateTime(event: Event): void {
    event.preventDefault();
    this.goNext(() => this.validateDateTime(), 3);
  }

  protected submitDetails(event: Event): void {
    event.preventDefault();
    this.goNext(() => this.validateDetails(), 4);
  }

  protected submitBooking(event: Event): void {
    event.preventDefault();
    if (this.validateCheckAnswers()) {
      this.errors.set({});
      this.referenceNumber.set(`APT-${Math.floor(100000 + Math.random() * 900000)}`);
      this.step.set(5);
      this.focusStepHeading();
    } else {
      this.focusErrorSummary();
    }
  }

  protected startOver(): void {
    this.reason.set("");
    this.reasonOther.set("");
    this.appointmentDate.set("");
    this.appointmentTime.set("");
    this.fullName.set("");
    this.email.set("");
    this.phone.set("");
    this.needsSupport.set(false);
    this.confirmedAccurate.set(false);
    this.referenceNumber.set("");
    this.errors.set({});
    this.step.set(0);
    this.focusStepHeading();
  }
}
