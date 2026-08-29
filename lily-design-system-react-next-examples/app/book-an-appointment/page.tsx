"use client";

// Book an appointment -- Lily's flagship composed-page pattern (plan
// P6-T2), ported from the canonical SvelteKit reference (plan P6-T3). A
// multi-step GP-appointment booking wizard: reason, date and time, your
// details, check your answers, confirmation. Demonstrates ~29 components
// composed into one realistic flow, GOV.UK/NHS-style validation with a
// focused error summary per step, and focus management on step change (a
// single-page wizard has no route change for the browser to announce, so
// the page moves focus to the new step's heading itself). Full write-up:
// docs/patterns/book-an-appointment.md.
//
// This React port keeps every load-bearing pattern from the Svelte
// reference: `noValidate` on every <Form> (this library's inputs also set
// the native `required` attribute, so without it the browser's own
// constraint validation would intercept `Continue` before the custom
// ErrorSummary ever runs -- confirmed by testing an empty required step
// for real, see docs/patterns/book-an-appointment.md); RadioGroup is not
// re-wrapped in a second Fieldset (it already renders its own
// role="radiogroup" fieldset); RadioInput/CheckboxInput take their
// accessible name from `label` (rendered as aria-label), so each is
// wrapped in <Label> with matching visible text, exactly as the doc's
// "Label wraps a radio/checkbox" pattern describes; and every step
// transition moves focus to the new step's heading (or to the error
// summary on a failed validation).
//
// Deliberate deviation from the Svelte reference: focus management here
// is two `useEffect`s keyed on `step` and `errors` instead of scattered
// imperative `tick().then(focus)` calls in every transition function --
// the idiomatic React shape for "run this after the DOM commits", and it
// collapses five call sites down to two.

import { useEffect, useRef, useState } from "react";
import BackLink from "@lily/BackLink";
import WarningCallout from "@lily/WarningCallout";
import InsetText from "@lily/InsetText";
import Details from "@lily/Details";
import Button from "@lily/Button";
import StepList from "@lily/StepList";
import StepListItem from "@lily/StepListItem";
import Form from "@lily/Form";
import Field from "@lily/Field";
import Fieldset from "@lily/Fieldset";
import Label from "@lily/Label";
import Hint from "@lily/Hint";
import RadioGroup from "@lily/RadioGroup";
import RadioInput from "@lily/RadioInput";
import TextAreaInput from "@lily/TextAreaInput";
import CharacterCounter from "@lily/CharacterCounter";
import DateInput from "@lily/DateInput";
import Select from "@lily/Select";
import Option from "@lily/Option";
import TextInput from "@lily/TextInput";
import EmailInput from "@lily/EmailInput";
import TelInput from "@lily/TelInput";
import CheckboxInput from "@lily/CheckboxInput";
import ErrorSummary from "@lily/ErrorSummary";
import ErrorMessage from "@lily/ErrorMessage";
import SummaryList from "@lily/SummaryList";
import SummaryListItem from "@lily/SummaryListItem";
import StatusTag from "@lily/StatusTag";
import SuccessPanel from "@lily/SuccessPanel";
import Panel from "@lily/Panel";

type Step = 0 | 1 | 2 | 3 | 4 | 5;
type Reason = "" | "routine" | "follow-up" | "vaccination" | "other";
type TimeOfDay = "" | "morning" | "afternoon" | "evening";

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

function todayIso(): string {
    return new Date().toISOString().slice(0, 10);
}

function statusFor(
    step: Step,
    n: 1 | 2 | 3 | 4,
): "waiting" | "in-progress" | "finished" {
    if (step >= 5) return "finished";
    if (n < step) return "finished";
    if (n === step) return "in-progress";
    return "waiting";
}

export default function BookAnAppointmentPage() {
    const [step, setStep] = useState<Step>(0);

    const [reason, setReason] = useState<Reason>("");
    const [reasonOther, setReasonOther] = useState("");
    const [appointmentDate, setAppointmentDate] = useState("");
    const [appointmentTime, setAppointmentTime] = useState<TimeOfDay>("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [needsSupport, setNeedsSupport] = useState(false);
    const [confirmedAccurate, setConfirmedAccurate] = useState(false);
    const [referenceNumber, setReferenceNumber] = useState("");

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Focus management on step change. A single-page wizard has no route
    // change for the browser or a screen reader to announce on its own, so
    // every transition moves focus to the new step's own heading -- the
    // same outcome a real route change gives elsewhere in this app. Skip
    // the very first render: the initial page load should not steal focus
    // away from the top of the document.
    const hasMounted = useRef(false);
    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true;
            return;
        }
        document.getElementById("step-heading")?.focus();
    }, [step]);

    // GOV.UK/NHS error-summary pattern: when a step's validation produces
    // errors, move focus to the summary immediately so screen reader and
    // keyboard users land on the problem list rather than being left
    // wherever they were.
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            document.getElementById("booking-error-summary")?.focus();
        }
    }, [errors]);

    function validateReason(): boolean {
        const e: Record<string, string> = {};
        if (!reason) e.reason = "Select a reason for your appointment";
        else if (reason === "other" && !reasonOther.trim())
            e.reasonOther = "Enter details about your appointment";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    function validateDateTime(): boolean {
        const e: Record<string, string> = {};
        if (!appointmentDate) e.appointmentDate = "Enter your preferred date";
        else if (appointmentDate < todayIso())
            e.appointmentDate = "Enter a date that is today or in the future";
        if (!appointmentTime)
            e.appointmentTime = "Select a preferred time of day";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    function validateDetails(): boolean {
        const e: Record<string, string> = {};
        if (!fullName.trim()) e.fullName = "Enter your full name";
        if (!email.trim()) e.email = "Enter your email address";
        else if (!email.includes("@"))
            e.email = "Enter an email address in the correct format";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    function validateCheckAnswers(): boolean {
        const e: Record<string, string> = {};
        if (!confirmedAccurate)
            e.confirmedAccurate =
                "Confirm that the information above is correct";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    function goNext(validate: () => boolean, next: Step) {
        if (validate()) setStep(next);
    }

    function goBack(prev: Step) {
        setErrors({});
        setStep(prev);
    }

    function goToStep(n: Step) {
        setErrors({});
        setStep(n);
    }

    function submitBooking() {
        if (validateCheckAnswers()) {
            setReferenceNumber(
                `APT-${Math.floor(100000 + Math.random() * 900000)}`,
            );
            setStep(5);
        }
    }

    function startOver() {
        setReason("");
        setReasonOther("");
        setAppointmentDate("");
        setAppointmentTime("");
        setFullName("");
        setEmail("");
        setPhone("");
        setNeedsSupport(false);
        setConfirmedAccurate(false);
        setReferenceNumber("");
        setErrors({});
        setStep(0);
    }

    return (
        <main className="page-wrapper">
            <BackLink href="/">Back to examples</BackLink>

            <h1>Book an appointment</h1>

            {step >= 1 && step <= 4 && (
                <StepList label="Booking progress" current={step - 1}>
                    <StepListItem
                        status={statusFor(step, 1)}
                        current={step === 1}
                    >
                        Reason
                    </StepListItem>
                    <StepListItem
                        status={statusFor(step, 2)}
                        current={step === 2}
                    >
                        Date and time
                    </StepListItem>
                    <StepListItem
                        status={statusFor(step, 3)}
                        current={step === 3}
                    >
                        Your details
                    </StepListItem>
                    <StepListItem
                        status={statusFor(step, 4)}
                        current={step === 4}
                    >
                        Check your answers
                    </StepListItem>
                </StepList>
            )}

            {Object.keys(errors).length > 0 && (
                <ErrorSummary title="There is a problem" id="booking-error-summary">
                    <ul>
                        {errors.reason && (
                            <li>
                                <a href="#reason-routine">{errors.reason}</a>
                            </li>
                        )}
                        {errors.reasonOther && (
                            <li>
                                <a href="#reason-other-detail">
                                    {errors.reasonOther}
                                </a>
                            </li>
                        )}
                        {errors.appointmentDate && (
                            <li>
                                <a href="#appointment-date">
                                    {errors.appointmentDate}
                                </a>
                            </li>
                        )}
                        {errors.appointmentTime && (
                            <li>
                                <a href="#appointment-time">
                                    {errors.appointmentTime}
                                </a>
                            </li>
                        )}
                        {errors.fullName && (
                            <li>
                                <a href="#full-name">{errors.fullName}</a>
                            </li>
                        )}
                        {errors.email && (
                            <li>
                                <a href="#email">{errors.email}</a>
                            </li>
                        )}
                        {errors.confirmedAccurate && (
                            <li>
                                <a href="#confirmed-accurate">
                                    {errors.confirmedAccurate}
                                </a>
                            </li>
                        )}
                    </ul>
                </ErrorSummary>
            )}

            {step === 0 && (
                <>
                    <h2 id="step-heading" tabIndex={-1}>
                        Before you start
                    </h2>

                    <WarningCallout label="Emergency notice">
                        <p>
                            If you have a medical emergency, call 999 or go to
                            your nearest A&amp;E.
                        </p>
                    </WarningCallout>

                    <p>
                        Use this service to book a routine appointment with
                        your GP surgery online. It takes about 5 minutes.
                    </p>

                    <InsetText>
                        Appointments are available Monday to Friday, 8am to
                        6pm. Most requests are confirmed within 2 working
                        days.
                    </InsetText>

                    <Details summary="What happens at your appointment">
                        <p>
                            A clinician will review the reason you gave for
                            the appointment and may ask follow-up questions.
                            Bring a list of any medicines you are currently
                            taking.
                        </p>
                    </Details>

                    <p>
                        <Button onClick={() => goToStep(1)}>Start now</Button>
                    </p>
                </>
            )}

            {step === 1 && (
                <>
                    <h2 id="step-heading" tabIndex={-1}>
                        Reason for your appointment
                    </h2>

                    <Form
                        label="Reason for your appointment"
                        noValidate
                        onSubmit={() => goNext(validateReason, 2)}
                    >
                        <RadioGroup label="Why do you need an appointment?">
                            <Label>
                                <RadioInput
                                    id="reason-routine"
                                    label={REASON_LABELS.routine}
                                    name="reason"
                                    value="routine"
                                    checked={reason === "routine"}
                                    onChange={() => setReason("routine")}
                                />
                                {REASON_LABELS.routine}
                            </Label>
                            <Label>
                                <RadioInput
                                    id="reason-follow-up"
                                    label={REASON_LABELS["follow-up"]}
                                    name="reason"
                                    value="follow-up"
                                    checked={reason === "follow-up"}
                                    onChange={() => setReason("follow-up")}
                                />
                                {REASON_LABELS["follow-up"]}
                            </Label>
                            <Label>
                                <RadioInput
                                    id="reason-vaccination"
                                    label={REASON_LABELS.vaccination}
                                    name="reason"
                                    value="vaccination"
                                    checked={reason === "vaccination"}
                                    onChange={() => setReason("vaccination")}
                                />
                                {REASON_LABELS.vaccination}
                            </Label>
                            <Label>
                                <RadioInput
                                    id="reason-other"
                                    label={REASON_LABELS.other}
                                    name="reason"
                                    value="other"
                                    checked={reason === "other"}
                                    onChange={() => setReason("other")}
                                />
                                {REASON_LABELS.other}
                            </Label>
                        </RadioGroup>
                        {errors.reason && (
                            <ErrorMessage>{errors.reason}</ErrorMessage>
                        )}

                        {reason === "other" && (
                            <>
                                <Field
                                    label="Tell us more"
                                    required
                                    error={errors.reasonOther}
                                    inputId="reason-other-detail"
                                >
                                    <TextAreaInput
                                        id="reason-other-detail"
                                        label="Tell us more about the reason for your appointment"
                                        value={reasonOther}
                                        onChange={setReasonOther}
                                        rows={4}
                                        required
                                    />
                                </Field>
                                <CharacterCounter
                                    count={reasonOther.length}
                                    max={250}
                                    label="Characters used"
                                />
                            </>
                        )}

                        <p>
                            <Button type="submit">Continue</Button>
                        </p>
                    </Form>
                </>
            )}

            {step === 2 && (
                <>
                    <h2 id="step-heading" tabIndex={-1}>
                        Choose a date and time
                    </h2>

                    <InsetText>
                        Appointments are available Monday to Friday, 8am to
                        6pm.
                    </InsetText>

                    <Form
                        label="Choose a date and time"
                        noValidate
                        onSubmit={() => goNext(validateDateTime, 3)}
                    >
                        <Fieldset legend="Preferred date and time">
                            <Field
                                label="Preferred date"
                                required
                                error={errors.appointmentDate}
                                inputId="appointment-date"
                            >
                                <Hint id="appointment-date-hint">
                                    We will try to match your preference, but
                                    availability may vary.
                                </Hint>
                                <DateInput
                                    id="appointment-date"
                                    label="Preferred date"
                                    value={appointmentDate}
                                    onChange={setAppointmentDate}
                                    min={todayIso()}
                                    required
                                    aria-describedby="appointment-date-hint"
                                />
                            </Field>

                            <Field
                                label="Preferred time of day"
                                required
                                error={errors.appointmentTime}
                                inputId="appointment-time"
                            >
                                <Select
                                    id="appointment-time"
                                    label="Preferred time of day"
                                    value={appointmentTime}
                                    onChange={(value) =>
                                        setAppointmentTime(
                                            value as TimeOfDay,
                                        )
                                    }
                                    required
                                >
                                    <Option value="">
                                        Select a time of day
                                    </Option>
                                    <Option value="morning">
                                        {TIME_LABELS.morning}
                                    </Option>
                                    <Option value="afternoon">
                                        {TIME_LABELS.afternoon}
                                    </Option>
                                    <Option value="evening">
                                        {TIME_LABELS.evening}
                                    </Option>
                                </Select>
                            </Field>
                        </Fieldset>

                        <p
                            style={{
                                display: "flex",
                                gap: "var(--nhs-space-3)",
                            }}
                        >
                            <Button
                                type="button"
                                onClick={() => goBack(1)}
                            >
                                Back
                            </Button>
                            <Button type="submit">Continue</Button>
                        </p>
                    </Form>
                </>
            )}

            {step === 3 && (
                <>
                    <h2 id="step-heading" tabIndex={-1}>
                        Your details
                    </h2>

                    <Form
                        label="Your details"
                        noValidate
                        onSubmit={() => goNext(validateDetails, 4)}
                    >
                        <Field
                            label="Full name"
                            required
                            error={errors.fullName}
                            inputId="full-name"
                        >
                            <TextInput
                                id="full-name"
                                label="Full name"
                                value={fullName}
                                onChange={setFullName}
                                required
                            />
                        </Field>

                        <Field
                            label="Email address"
                            required
                            error={errors.email}
                            inputId="email"
                        >
                            <Hint id="email-hint">
                                We will use this to send your confirmation.
                            </Hint>
                            <EmailInput
                                id="email"
                                label="Email address"
                                value={email}
                                onChange={setEmail}
                                required
                                aria-describedby="email-hint"
                            />
                        </Field>

                        <Field label="Phone number" inputId="phone">
                            <Hint id="phone-hint">
                                Optional — only needed if we must contact you
                                about a change.
                            </Hint>
                            <TelInput
                                id="phone"
                                label="Phone number"
                                value={phone}
                                onChange={setPhone}
                                aria-describedby="phone-hint"
                            />
                        </Field>

                        <p>
                            <Label>
                                <CheckboxInput
                                    label="I need an interpreter or additional support"
                                    checked={needsSupport}
                                    onChange={setNeedsSupport}
                                />
                                I need an interpreter or additional support
                            </Label>
                        </p>

                        <p
                            style={{
                                display: "flex",
                                gap: "var(--nhs-space-3)",
                            }}
                        >
                            <Button
                                type="button"
                                onClick={() => goBack(2)}
                            >
                                Back
                            </Button>
                            <Button type="submit">Continue</Button>
                        </p>
                    </Form>
                </>
            )}

            {step === 4 && (
                <>
                    <h2 id="step-heading" tabIndex={-1}>
                        Check your answers
                    </h2>

                    <SummaryList label="Your appointment details">
                        <SummaryListItem term="Reason">
                            {REASON_LABELS[reason] || "Not answered"}
                            {reason === "other" && reasonOther && (
                                <>
                                    <br />
                                    <span>{reasonOther}</span>
                                </>
                            )}{" "}
                            <a
                                href="#reason"
                                onClick={(e) => {
                                    e.preventDefault();
                                    goToStep(1);
                                }}
                            >
                                Change
                                <span className="visually-hidden">
                                    {" "}
                                    reason
                                </span>
                            </a>
                        </SummaryListItem>
                        <SummaryListItem term="Date">
                            {appointmentDate || "Not answered"}{" "}
                            <a
                                href="#date"
                                onClick={(e) => {
                                    e.preventDefault();
                                    goToStep(2);
                                }}
                            >
                                Change
                                <span className="visually-hidden">
                                    {" "}
                                    date
                                </span>
                            </a>
                        </SummaryListItem>
                        <SummaryListItem term="Time of day">
                            {appointmentTime
                                ? TIME_LABELS[appointmentTime]
                                : "Not answered"}{" "}
                            <a
                                href="#time"
                                onClick={(e) => {
                                    e.preventDefault();
                                    goToStep(2);
                                }}
                            >
                                Change
                                <span className="visually-hidden">
                                    {" "}
                                    time of day
                                </span>
                            </a>
                        </SummaryListItem>
                        <SummaryListItem term="Full name">
                            {fullName || "Not answered"}{" "}
                            <a
                                href="#name"
                                onClick={(e) => {
                                    e.preventDefault();
                                    goToStep(3);
                                }}
                            >
                                Change
                                <span className="visually-hidden">
                                    {" "}
                                    full name
                                </span>
                            </a>
                        </SummaryListItem>
                        <SummaryListItem term="Email address">
                            {email || "Not answered"}{" "}
                            <a
                                href="#email-review"
                                onClick={(e) => {
                                    e.preventDefault();
                                    goToStep(3);
                                }}
                            >
                                Change
                                <span className="visually-hidden">
                                    {" "}
                                    email address
                                </span>
                            </a>
                        </SummaryListItem>
                        <SummaryListItem term="Phone number">
                            {phone ? (
                                phone
                            ) : (
                                <StatusTag>Not provided</StatusTag>
                            )}{" "}
                            <a
                                href="#phone-review"
                                onClick={(e) => {
                                    e.preventDefault();
                                    goToStep(3);
                                }}
                            >
                                Change
                                <span className="visually-hidden">
                                    {" "}
                                    phone number
                                </span>
                            </a>
                        </SummaryListItem>
                        <SummaryListItem term="Interpreter or additional support">
                            {needsSupport ? "Yes" : "No"}{" "}
                            <a
                                href="#support-review"
                                onClick={(e) => {
                                    e.preventDefault();
                                    goToStep(3);
                                }}
                            >
                                Change
                                <span className="visually-hidden">
                                    {" "}
                                    interpreter or additional support
                                </span>
                            </a>
                        </SummaryListItem>
                    </SummaryList>

                    <Form
                        label="Confirm and book your appointment"
                        noValidate
                        onSubmit={submitBooking}
                    >
                        <p>
                            <Label>
                                <CheckboxInput
                                    id="confirmed-accurate"
                                    label="I confirm the information above is correct"
                                    checked={confirmedAccurate}
                                    onChange={setConfirmedAccurate}
                                />
                                I confirm the information above is correct
                            </Label>
                            {errors.confirmedAccurate && (
                                <ErrorMessage>
                                    {errors.confirmedAccurate}
                                </ErrorMessage>
                            )}
                        </p>

                        <p
                            style={{
                                display: "flex",
                                gap: "var(--nhs-space-3)",
                            }}
                        >
                            <Button
                                type="button"
                                onClick={() => goBack(3)}
                            >
                                Back
                            </Button>
                            <Button type="submit">Confirm and book</Button>
                        </p>
                    </Form>
                </>
            )}

            {step === 5 && (
                <>
                    <h2 id="step-heading" tabIndex={-1}>
                        Booking confirmed
                    </h2>

                    <SuccessPanel label="Booking confirmed">
                        <p>
                            Your appointment reference number is{" "}
                            <strong>{referenceNumber}</strong>. We have sent
                            a confirmation to {email}.
                        </p>
                    </SuccessPanel>

                    <StepList label="Booking progress">
                        <StepListItem status="finished">
                            Reason
                        </StepListItem>
                        <StepListItem status="finished">
                            Date and time
                        </StepListItem>
                        <StepListItem status="finished">
                            Your details
                        </StepListItem>
                        <StepListItem status="finished">
                            Check your answers
                        </StepListItem>
                    </StepList>

                    <Panel label="What happens next">
                        <p>
                            A member of the practice team will confirm your{" "}
                            {appointmentTime
                                ? TIME_LABELS[appointmentTime].toLowerCase()
                                : ""}{" "}
                            appointment on {appointmentDate} by email. Keep
                            your reference number in case you need to change
                            or cancel.
                        </p>
                    </Panel>

                    <p>
                        <Button onClick={startOver}>
                            Book another appointment
                        </Button>
                    </p>
                </>
            )}
        </main>
    );
}
