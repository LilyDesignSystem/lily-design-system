// NewsletterSignup component
//
// An email subscription form composition with idle, submitting, success,
// and error states. Renders a semantic <form> with an aria-label, an
// email input, a submit button, and conditionally hidden status/alert
// messages.
//
// Props:
//   class        — string, optional. CSS class name appended to root.
//   label            — string, REQUIRED. aria-label for the form.
//   heading          — string, optional. Visible heading.
//   description      — string, optional. Body text under the heading.
//   emailLabel       — string, REQUIRED. Visible label for the email input.
//   emailPlaceholder — string, optional. Email input placeholder.
//   submitLabel      — string, REQUIRED. Submit button text.
//   state            — "idle" | "submitting" | "success" | "error",
//                      default "idle". Exposed via data-state.
//   successMessage   — string, optional. Message shown when state is
//                      "success" via role="status" + aria-live="polite".
//   errorMessage     — string, optional. Message shown when state is
//                      "error" via role="alert".
//   onSubmit         — submit handler.
//   ...restProps     — additional HTML attributes spread onto the root.
//
// Syntax:
//   <NewsletterSignup
//     label="Newsletter signup"
//     heading="Stay in the loop"
//     description="Monthly updates, no spam."
//     emailLabel="Email address"
//     submitLabel="Subscribe"
//     state={state}
//     successMessage="Thanks for subscribing!"
//     errorMessage="Something went wrong."
//     onSubmit={handleSubmit}
//   />
//
// Accessibility:
//   - <form> has an aria-label
//   - Success message uses role="status" + aria-live="polite"
//   - Error message uses role="alert"
//   - Both status nodes are conditionally hidden when not active
//
// Internationalization:
//   - All user-facing strings are consumer-supplied
//
// Claude rules:
//   - Headless: no CSS, no styles
//   - label, emailLabel, submitLabel are non-optional in the interface

import { merge, omit } from "solid-js";
import { attr } from "./attr";
export type NewsletterSignupState = "idle" | "submitting" | "success" | "error";

export interface NewsletterSignupProps {
    class?: string;
    /** aria-label for the form */
    label: string;
    /** Visible heading text */
    heading?: string;
    /** Body text rendered below the heading */
    description?: string;
    /** Visible label for the email input */
    emailLabel: string;
    /** Placeholder for the email input */
    emailPlaceholder?: string;
    /** Submit button text */
    submitLabel: string;
    /** Current form state */
    state?: NewsletterSignupState;
    /** Confirmation message displayed when state is "success" */
    successMessage?: string;
    /** Error message displayed when state is "error" */
    errorMessage?: string;
    /** Submit handler */
    onSubmit?: (event: Event) => void;
    [key: string]: unknown;
}

export default function NewsletterSignup(props: NewsletterSignupProps) {
    const p = merge({ class: "" as const, state: "idle" as const }, props);
    const restProps = omit(
        p,
        "class",
        "label",
        "heading",
        "description",
        "emailLabel",
        "emailPlaceholder",
        "submitLabel",
        "state",
        "successMessage",
        "errorMessage",
        "onSubmit",
    );
    const submitting = () => p.state === "submitting";
    return (
        <form
            class={`newsletter-signup ${p.class}`}
            aria-label={p.label}
            data-state={attr(p.state)}
            onSubmit={p.onSubmit}
            {...restProps}
        >
            {(p.heading || p.description) && (
                <header class="newsletter-signup-header">
                    {p.heading && <h3 class="newsletter-signup-heading">{p.heading}</h3>}
                    {p.description && <p class="newsletter-signup-description">{p.description}</p>}
                </header>
            )}
            <label class="newsletter-signup-label">
                {p.emailLabel}
                <input
                    class="newsletter-signup-input"
                    type="email"
                    disabled={submitting()}
                    placeholder={p.emailPlaceholder}
                />
            </label>
            <button
                class="newsletter-signup-submit"
                type="submit"
                disabled={submitting()}
            >
                {p.submitLabel}
            </button>
            <p
                class="newsletter-signup-success"
                role="status"
                aria-live="polite"
                hidden={p.state !== "success"}
            >
                {p.successMessage}
            </p>
            <p
                class="newsletter-signup-error"
                role="alert"
                hidden={p.state !== "error"}
            >
                {p.errorMessage}
            </p>
        </form>
    );
}
