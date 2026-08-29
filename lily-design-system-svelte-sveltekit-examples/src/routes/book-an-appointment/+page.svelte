<script lang="ts">
    // Book an appointment — Lily's flagship composed-page pattern (plan
    // P6-T2). A multi-step GP-appointment booking wizard: reason, date and
    // time, your details, check your answers, confirmation. Demonstrates
    // ~30 components composed into one realistic flow, GOV.UK/NHS-style
    // validation with a focused error summary per step, and focus
    // management on step change (a single-page wizard has no route change
    // for the browser to announce, so the page moves focus to the new
    // step's heading itself). Full write-up: docs/patterns/book-an-appointment.md.
    import { tick } from "svelte";

    import Header from "$lib/components/Header/Header.svelte";
    import Footer from "$lib/components/Footer/Footer.svelte";
    import BackLink from "$lib/components/BackLink/BackLink.svelte";
    import WarningCallout from "$lib/components/WarningCallout/WarningCallout.svelte";
    import InsetText from "$lib/components/InsetText/InsetText.svelte";
    import Details from "$lib/components/Details/Details.svelte";
    import Button from "$lib/components/Button/Button.svelte";
    import StepList from "$lib/components/StepList/StepList.svelte";
    import StepListItem from "$lib/components/StepListItem/StepListItem.svelte";
    import Form from "$lib/components/Form/Form.svelte";
    import Field from "$lib/components/Field/Field.svelte";
    import Fieldset from "$lib/components/Fieldset/Fieldset.svelte";
    import Label from "$lib/components/Label/Label.svelte";
    import Hint from "$lib/components/Hint/Hint.svelte";
    import RadioGroup from "$lib/components/RadioGroup/RadioGroup.svelte";
    import RadioInput from "$lib/components/RadioInput/RadioInput.svelte";
    import TextAreaInput from "$lib/components/TextAreaInput/TextAreaInput.svelte";
    import CharacterCounter from "$lib/components/CharacterCounter/CharacterCounter.svelte";
    import DateInput from "$lib/components/DateInput/DateInput.svelte";
    import Select from "$lib/components/Select/Select.svelte";
    import Option from "$lib/components/Option/Option.svelte";
    import TextInput from "$lib/components/TextInput/TextInput.svelte";
    import EmailInput from "$lib/components/EmailInput/EmailInput.svelte";
    import TelInput from "$lib/components/TelInput/TelInput.svelte";
    import CheckboxInput from "$lib/components/CheckboxInput/CheckboxInput.svelte";
    import ErrorSummary from "$lib/components/ErrorSummary/ErrorSummary.svelte";
    import ErrorMessage from "$lib/components/ErrorMessage/ErrorMessage.svelte";
    import SummaryList from "$lib/components/SummaryList/SummaryList.svelte";
    import SummaryListItem from "$lib/components/SummaryListItem/SummaryListItem.svelte";
    import StatusTag from "$lib/components/StatusTag/StatusTag.svelte";
    import SuccessPanel from "$lib/components/SuccessPanel/SuccessPanel.svelte";
    import Panel from "$lib/components/Panel/Panel.svelte";

    type Step = 0 | 1 | 2 | 3 | 4 | 5;

    let step: Step = $state(0);

    // Form state.
    let reason: "" | "routine" | "follow-up" | "vaccination" | "other" =
        $state("");
    let reasonOther = $state("");
    let appointmentDate = $state("");
    let appointmentTime: "" | "morning" | "afternoon" | "evening" =
        $state("");
    let fullName = $state("");
    let email = $state("");
    let phone = $state("");
    let needsSupport = $state(false);
    let confirmedAccurate = $state(false);
    let referenceNumber = $state("");

    let errors: Record<string, string> = $state({});

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

    // Focus management on step change. A single-page wizard has no route
    // change for the browser or a screen reader to announce on its own, so
    // the page moves focus to the new step's own heading -- the same
    // outcome SvelteKit's page-navigation focus reset gives real route
    // changes elsewhere in this app. See docs/patterns/book-an-appointment.md.
    async function focusStepHeading() {
        await tick();
        document.getElementById("step-heading")?.focus();
    }

    // GOV.UK/NHS error-summary pattern: render the summary, then move focus
    // to it so screen reader and keyboard users land on the problem list
    // immediately rather than being left wherever they were.
    async function focusErrorSummary() {
        await tick();
        document.getElementById("booking-error-summary")?.focus();
    }

    function validateReason(): boolean {
        const e: Record<string, string> = {};
        if (!reason) e.reason = "Select a reason for your appointment";
        else if (reason === "other" && !reasonOther.trim())
            e.reasonOther = "Enter details about your appointment";
        errors = e;
        return Object.keys(e).length === 0;
    }

    function validateDateTime(): boolean {
        const e: Record<string, string> = {};
        if (!appointmentDate)
            e.appointmentDate = "Enter your preferred date";
        else if (appointmentDate < todayIso())
            e.appointmentDate = "Enter a date that is today or in the future";
        if (!appointmentTime)
            e.appointmentTime = "Select a preferred time of day";
        errors = e;
        return Object.keys(e).length === 0;
    }

    function validateDetails(): boolean {
        const e: Record<string, string> = {};
        if (!fullName.trim()) e.fullName = "Enter your full name";
        if (!email.trim()) e.email = "Enter your email address";
        else if (!email.includes("@"))
            e.email = "Enter an email address in the correct format";
        errors = e;
        return Object.keys(e).length === 0;
    }

    function validateCheckAnswers(): boolean {
        const e: Record<string, string> = {};
        if (!confirmedAccurate)
            e.confirmedAccurate =
                "Confirm that the information above is correct";
        errors = e;
        return Object.keys(e).length === 0;
    }

    function goNext(validate: () => boolean, next: Step) {
        if (validate()) {
            errors = {};
            step = next;
            focusStepHeading();
        } else {
            focusErrorSummary();
        }
    }

    function goBack(prev: Step) {
        errors = {};
        step = prev;
        focusStepHeading();
    }

    function goToStep(n: Step) {
        errors = {};
        step = n;
        focusStepHeading();
    }

    function submitBooking() {
        if (validateCheckAnswers()) {
            errors = {};
            referenceNumber = `APT-${Math.floor(100000 + Math.random() * 900000)}`;
            step = 5;
            focusStepHeading();
        } else {
            focusErrorSummary();
        }
    }

    function startOver() {
        reason = "";
        reasonOther = "";
        appointmentDate = "";
        appointmentTime = "";
        fullName = "";
        email = "";
        phone = "";
        needsSupport = false;
        confirmedAccurate = false;
        referenceNumber = "";
        errors = {};
        step = 0;
        focusStepHeading();
    }

    function statusFor(n: 1 | 2 | 3 | 4): "waiting" | "in-progress" | "finished" {
        if (step >= 5) return "finished";
        if (n < step) return "finished";
        if (n === step) return "in-progress";
        return "waiting";
    }
</script>

<Header label="Site header">
    <div class="page-wrapper">
        <h1>Book an appointment</h1>
    </div>
</Header>

<main class="page-wrapper">
    <BackLink href="/">Back to examples</BackLink>

    {#if step >= 1 && step <= 4}
        <StepList label="Booking progress" current={step - 1}>
            <StepListItem status={statusFor(1)} current={step === 1}
                >Reason</StepListItem
            >
            <StepListItem status={statusFor(2)} current={step === 2}
                >Date and time</StepListItem
            >
            <StepListItem status={statusFor(3)} current={step === 3}
                >Your details</StepListItem
            >
            <StepListItem status={statusFor(4)} current={step === 4}
                >Check your answers</StepListItem
            >
        </StepList>
    {/if}

    {#if Object.keys(errors).length > 0}
        <ErrorSummary title="There is a problem" id="booking-error-summary">
            <ul>
                {#if errors.reason}
                    <li><a href="#reason-routine">{errors.reason}</a></li>
                {/if}
                {#if errors.reasonOther}
                    <li>
                        <a href="#reason-other-detail">{errors.reasonOther}</a>
                    </li>
                {/if}
                {#if errors.appointmentDate}
                    <li>
                        <a href="#appointment-date"
                            >{errors.appointmentDate}</a
                        >
                    </li>
                {/if}
                {#if errors.appointmentTime}
                    <li>
                        <a href="#appointment-time"
                            >{errors.appointmentTime}</a
                        >
                    </li>
                {/if}
                {#if errors.fullName}
                    <li><a href="#full-name">{errors.fullName}</a></li>
                {/if}
                {#if errors.email}
                    <li><a href="#email">{errors.email}</a></li>
                {/if}
                {#if errors.confirmedAccurate}
                    <li>
                        <a href="#confirmed-accurate"
                            >{errors.confirmedAccurate}</a
                        >
                    </li>
                {/if}
            </ul>
        </ErrorSummary>
    {/if}

    {#if step === 0}
        <h2 id="step-heading" tabindex="-1">Before you start</h2>

        <WarningCallout label="Emergency notice">
            <p>
                If you have a medical emergency, call 999 or go to your
                nearest A&amp;E.
            </p>
        </WarningCallout>

        <p>
            Use this service to book a routine appointment with your GP
            surgery online. It takes about 5 minutes.
        </p>

        <InsetText>
            Appointments are available Monday to Friday, 8am to 6pm. Most
            requests are confirmed within 2 working days.
        </InsetText>

        <Details summary="What happens at your appointment">
            <p>
                A clinician will review the reason you gave for the
                appointment and may ask follow-up questions. Bring a list of
                any medicines you are currently taking.
            </p>
        </Details>

        <p>
            <Button onclick={() => goToStep(1)}>Start now</Button>
        </p>
    {:else if step === 1}
        <h2 id="step-heading" tabindex="-1">Reason for your appointment</h2>

        <Form
            label="Reason for your appointment"
            novalidate
            onsubmit={() => goNext(validateReason, 2)}
        >
            <RadioGroup label="Why do you need an appointment?">
                <Label>
                    <RadioInput
                        id="reason-routine"
                        label={REASON_LABELS.routine}
                        name="reason"
                        value="routine"
                        checked={reason === "routine"}
                        onchange={() => (reason = "routine")}
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
                        onchange={() => (reason = "follow-up")}
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
                        onchange={() => (reason = "vaccination")}
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
                        onchange={() => (reason = "other")}
                    />
                    {REASON_LABELS.other}
                </Label>
            </RadioGroup>
            {#if errors.reason}
                <ErrorMessage>{errors.reason}</ErrorMessage>
            {/if}

            {#if reason === "other"}
                <Field
                    label="Tell us more"
                    required
                    error={errors.reasonOther}
                    inputId="reason-other-detail"
                >
                    <TextAreaInput
                        id="reason-other-detail"
                        label="Tell us more about the reason for your appointment"
                        bind:value={reasonOther}
                        rows={4}
                        required
                    />
                </Field>
                <CharacterCounter
                    count={reasonOther.length}
                    max={250}
                    label="Characters used"
                />
            {/if}

            <p><Button type="submit">Continue</Button></p>
        </Form>
    {:else if step === 2}
        <h2 id="step-heading" tabindex="-1">Choose a date and time</h2>

        <InsetText
            >Appointments are available Monday to Friday, 8am to 6pm.</InsetText
        >

        <Form
            label="Choose a date and time"
            novalidate
            onsubmit={() => goNext(validateDateTime, 3)}
        >
            <Fieldset legend="Preferred date and time">
                <Field
                    label="Preferred date"
                    required
                    error={errors.appointmentDate}
                    inputId="appointment-date"
                >
                    <Hint id="appointment-date-hint"
                        >We will try to match your preference, but
                        availability may vary.</Hint
                    >
                    <DateInput
                        id="appointment-date"
                        label="Preferred date"
                        bind:value={appointmentDate}
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
                        bind:value={appointmentTime}
                        required
                    >
                        <Option value="">Select a time of day</Option>
                        <Option value="morning"
                            >{TIME_LABELS.morning}</Option
                        >
                        <Option value="afternoon"
                            >{TIME_LABELS.afternoon}</Option
                        >
                        <Option value="evening"
                            >{TIME_LABELS.evening}</Option
                        >
                    </Select>
                </Field>
            </Fieldset>

            <p style="display: flex; gap: var(--nhs-space-3);">
                <Button type="button" onclick={() => goBack(1)}>Back</Button>
                <Button type="submit">Continue</Button>
            </p>
        </Form>
    {:else if step === 3}
        <h2 id="step-heading" tabindex="-1">Your details</h2>

        <Form
            label="Your details"
            novalidate
            onsubmit={() => goNext(validateDetails, 4)}
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
                    bind:value={fullName}
                    required
                />
            </Field>

            <Field
                label="Email address"
                required
                error={errors.email}
                inputId="email"
            >
                <Hint id="email-hint"
                    >We will use this to send your confirmation.</Hint
                >
                <EmailInput
                    id="email"
                    label="Email address"
                    bind:value={email}
                    required
                    aria-describedby="email-hint"
                />
            </Field>

            <Field label="Phone number" inputId="phone">
                <Hint id="phone-hint"
                    >Optional — only needed if we must contact you about a
                    change.</Hint
                >
                <TelInput
                    id="phone"
                    label="Phone number"
                    bind:value={phone}
                    aria-describedby="phone-hint"
                />
            </Field>

            <p>
                <Label>
                    <CheckboxInput
                        label="I need an interpreter or additional support"
                        bind:checked={needsSupport}
                    />
                    I need an interpreter or additional support
                </Label>
            </p>

            <p style="display: flex; gap: var(--nhs-space-3);">
                <Button type="button" onclick={() => goBack(2)}>Back</Button>
                <Button type="submit">Continue</Button>
            </p>
        </Form>
    {:else if step === 4}
        <h2 id="step-heading" tabindex="-1">Check your answers</h2>

        <SummaryList label="Your appointment details">
            <SummaryListItem term="Reason">
                {REASON_LABELS[reason] || "Not answered"}
                {#if reason === "other" && reasonOther}
                    <br /><span>{reasonOther}</span>
                {/if}
                <a href="#reason" onclick={(e) => { e.preventDefault(); goToStep(1); }}
                    >Change<span class="visually-hidden"> reason</span></a
                >
            </SummaryListItem>
            <SummaryListItem term="Date">
                {appointmentDate || "Not answered"}
                <a
                    href="#date"
                    onclick={(e) => { e.preventDefault(); goToStep(2); }}
                    >Change<span class="visually-hidden"> date</span></a
                >
            </SummaryListItem>
            <SummaryListItem term="Time of day">
                {appointmentTime ? TIME_LABELS[appointmentTime] : "Not answered"}
                <a
                    href="#time"
                    onclick={(e) => { e.preventDefault(); goToStep(2); }}
                    >Change<span class="visually-hidden"> time of day</span
                    ></a
                >
            </SummaryListItem>
            <SummaryListItem term="Full name">
                {fullName || "Not answered"}
                <a
                    href="#name"
                    onclick={(e) => { e.preventDefault(); goToStep(3); }}
                    >Change<span class="visually-hidden"> full name</span></a
                >
            </SummaryListItem>
            <SummaryListItem term="Email address">
                {email || "Not answered"}
                <a
                    href="#email-review"
                    onclick={(e) => { e.preventDefault(); goToStep(3); }}
                    >Change<span class="visually-hidden"> email address</span
                    ></a
                >
            </SummaryListItem>
            <SummaryListItem term="Phone number">
                {#if phone}
                    {phone}
                {:else}
                    <StatusTag>Not provided</StatusTag>
                {/if}
                <a
                    href="#phone-review"
                    onclick={(e) => { e.preventDefault(); goToStep(3); }}
                    >Change<span class="visually-hidden"> phone number</span
                    ></a
                >
            </SummaryListItem>
            <SummaryListItem term="Interpreter or additional support">
                {needsSupport ? "Yes" : "No"}
                <a
                    href="#support-review"
                    onclick={(e) => { e.preventDefault(); goToStep(3); }}
                    >Change<span class="visually-hidden"
                        > interpreter or additional support</span
                    ></a
                >
            </SummaryListItem>
        </SummaryList>

        <Form
            label="Confirm and book your appointment"
            novalidate
            onsubmit={submitBooking}
        >
            <p>
                <Label>
                    <CheckboxInput
                        id="confirmed-accurate"
                        label="I confirm the information above is correct"
                        bind:checked={confirmedAccurate}
                    />
                    I confirm the information above is correct
                </Label>
                {#if errors.confirmedAccurate}
                    <ErrorMessage>{errors.confirmedAccurate}</ErrorMessage>
                {/if}
            </p>

            <p style="display: flex; gap: var(--nhs-space-3);">
                <Button type="button" onclick={() => goBack(3)}>Back</Button>
                <Button type="submit">Confirm and book</Button>
            </p>
        </Form>
    {:else if step === 5}
        <h2 id="step-heading" tabindex="-1">Booking confirmed</h2>

        <SuccessPanel label="Booking confirmed">
            <p>
                Your appointment reference number is
                <strong>{referenceNumber}</strong>. We have sent a
                confirmation to {email}.
            </p>
        </SuccessPanel>

        <StepList label="Booking progress">
            <StepListItem status="finished">Reason</StepListItem>
            <StepListItem status="finished">Date and time</StepListItem>
            <StepListItem status="finished">Your details</StepListItem>
            <StepListItem status="finished">Check your answers</StepListItem>
        </StepList>

        <Panel label="What happens next">
            <p>
                A member of the practice team will confirm your
                {appointmentTime
                    ? TIME_LABELS[appointmentTime].toLowerCase()
                    : ""} appointment on {appointmentDate} by email. Keep your
                reference number in case you need to change or cancel.
            </p>
        </Panel>

        <p><Button onclick={startOver}>Book another appointment</Button></p>
    {/if}
</main>

<Footer label="Site footer">
    <div class="page-wrapper">
        <p>Lily Design System — Book an Appointment Example</p>
    </div>
</Footer>

<style>
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
</style>
