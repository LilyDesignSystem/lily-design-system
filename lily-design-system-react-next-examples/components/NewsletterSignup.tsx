// NewsletterSignup component
//
// An email subscription form composition with idle, submitting, success,
// and error states. Renders a semantic <form> with an aria-label, an
// email input, a submit button, and conditionally hidden status/alert
// messages.
//
// Props:
//   className        — string, optional. CSS class name appended to root.
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

import React from "react";

export type NewsletterSignupState =
    | "idle"
    | "submitting"
    | "success"
    | "error";

export interface NewsletterSignupProps {
    className?: string;
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
    onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
    [key: string]: unknown;
}

export default function NewsletterSignup({
    className = "",
    label,
    heading = undefined,
    description = undefined,
    emailLabel,
    emailPlaceholder = undefined,
    submitLabel,
    state = "idle",
    successMessage = undefined,
    errorMessage = undefined,
    onSubmit = undefined,
    ...restProps
}: NewsletterSignupProps) {
    const submitting = state === "submitting";
    return (
        <form
            className={`newsletter-signup ${className}`}
            aria-label={label}
            data-state={state}
            onSubmit={onSubmit}
            {...restProps}
        >
            {(heading || description) && (
                <header className="newsletter-signup-header">
                    {heading && (
                        <h3 className="newsletter-signup-heading">{heading}</h3>
                    )}
                    {description && (
                        <p className="newsletter-signup-description">
                            {description}
                        </p>
                    )}
                </header>
            )}
            <label className="newsletter-signup-label">
                {emailLabel}
                <input
                    className="newsletter-signup-input"
                    type="email"
                    disabled={submitting}
                    placeholder={emailPlaceholder}
                />
            </label>
            <button
                className="newsletter-signup-submit"
                type="submit"
                disabled={submitting}
            >
                {submitLabel}
            </button>
            <p
                className="newsletter-signup-success"
                role="status"
                aria-live="polite"
                hidden={state !== "success"}
            >
                {successMessage}
            </p>
            <p
                className="newsletter-signup-error"
                role="alert"
                hidden={state !== "error"}
            >
                {errorMessage}
            </p>
        </form>
    );
}
