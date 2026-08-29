<script setup lang="ts">
// Book an appointment — Lily's flagship composed-page pattern (plan P6-T2),
// ported to Vue/Nuxt (plan P6-T3). A multi-step GP-appointment booking
// wizard: reason, date and time, your details, check your answers,
// confirmation. Demonstrates ~30 components composed into one realistic
// flow, GOV.UK/NHS-style validation with a focused error summary per step,
// and focus management on step change (a single-page wizard has no route
// change for the browser to announce, so the page moves focus to the new
// step's heading itself). Full write-up: docs/patterns/book-an-appointment.md.
import { ref, reactive, computed, nextTick } from "vue";

type Step = 0 | 1 | 2 | 3 | 4 | 5;
type Reason = "" | "routine" | "follow-up" | "vaccination" | "other";
type TimeOfDay = "" | "morning" | "afternoon" | "evening";

const step = ref<Step>(0);

// Form state.
const reason = ref<Reason>("");
const reasonOther = ref("");
const appointmentDate = ref("");
const appointmentTime = ref<TimeOfDay>("");
const fullName = ref("");
const email = ref("");
const phone = ref("");
const needsSupport = ref(false);
const confirmedAccurate = ref(false);
const referenceNumber = ref("");

const errors = reactive<Record<string, string>>({});
const hasErrors = computed(() => Object.keys(errors).length > 0);

function clearErrors() {
    Object.keys(errors).forEach((k) => delete errors[k]);
}

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
// the page moves focus to the new step's own heading -- the same outcome
// a route change gives elsewhere in this app. See
// docs/patterns/book-an-appointment.md.
const stepHeadingRef = ref<HTMLHeadingElement | null>(null);

async function focusStepHeading() {
    await nextTick();
    stepHeadingRef.value?.focus();
}

// GOV.UK/NHS error-summary pattern: render the summary, then move focus
// to it so screen reader and keyboard users land on the problem list
// immediately rather than being left wherever they were.
async function focusErrorSummary() {
    await nextTick();
    document.getElementById("booking-error-summary")?.focus();
}

function validateReason(): boolean {
    clearErrors();
    if (!reason.value) errors.reason = "Select a reason for your appointment";
    else if (reason.value === "other" && !reasonOther.value.trim())
        errors.reasonOther = "Enter details about your appointment";
    return Object.keys(errors).length === 0;
}

function validateDateTime(): boolean {
    clearErrors();
    if (!appointmentDate.value) errors.appointmentDate = "Enter your preferred date";
    else if (appointmentDate.value < todayIso())
        errors.appointmentDate = "Enter a date that is today or in the future";
    if (!appointmentTime.value) errors.appointmentTime = "Select a preferred time of day";
    return Object.keys(errors).length === 0;
}

function validateDetails(): boolean {
    clearErrors();
    if (!fullName.value.trim()) errors.fullName = "Enter your full name";
    if (!email.value.trim()) errors.email = "Enter your email address";
    else if (!email.value.includes("@"))
        errors.email = "Enter an email address in the correct format";
    return Object.keys(errors).length === 0;
}

function validateCheckAnswers(): boolean {
    clearErrors();
    if (!confirmedAccurate.value)
        errors.confirmedAccurate = "Confirm that the information above is correct";
    return Object.keys(errors).length === 0;
}

function goNext(validate: () => boolean, next: Step) {
    if (validate()) {
        clearErrors();
        step.value = next;
        focusStepHeading();
    } else {
        focusErrorSummary();
    }
}

function goBack(prev: Step) {
    clearErrors();
    step.value = prev;
    focusStepHeading();
}

function goToStep(n: Step) {
    clearErrors();
    step.value = n;
    focusStepHeading();
}

function submitBooking() {
    if (validateCheckAnswers()) {
        clearErrors();
        referenceNumber.value = `APT-${Math.floor(100000 + Math.random() * 900000)}`;
        step.value = 5;
        focusStepHeading();
    } else {
        focusErrorSummary();
    }
}

function startOver() {
    reason.value = "";
    reasonOther.value = "";
    appointmentDate.value = "";
    appointmentTime.value = "";
    fullName.value = "";
    email.value = "";
    phone.value = "";
    needsSupport.value = false;
    confirmedAccurate.value = false;
    referenceNumber.value = "";
    clearErrors();
    step.value = 0;
    focusStepHeading();
}

function statusFor(n: 1 | 2 | 3 | 4): "waiting" | "in-progress" | "finished" {
    if (step.value >= 5) return "finished";
    if (n < step.value) return "finished";
    if (n === step.value) return "in-progress";
    return "waiting";
}
</script>

<template>
    <Header label="Site header">
        <div class="page-wrapper">
            <h1>Book an appointment</h1>
        </div>
    </Header>

    <main class="page-wrapper">
        <BackLink href="/">Back to examples</BackLink>

        <StepList v-if="step >= 1 && step <= 4" label="Booking progress" :current="step - 1">
            <StepListItem :status="statusFor(1)" :current="step === 1">Reason</StepListItem>
            <StepListItem :status="statusFor(2)" :current="step === 2">Date and time</StepListItem>
            <StepListItem :status="statusFor(3)" :current="step === 3">Your details</StepListItem>
            <StepListItem :status="statusFor(4)" :current="step === 4">Check your answers</StepListItem>
        </StepList>

        <ErrorSummary v-if="hasErrors" title="There is a problem" id="booking-error-summary">
            <ul>
                <li v-if="errors.reason"><a href="#reason-routine">{{ errors.reason }}</a></li>
                <li v-if="errors.reasonOther">
                    <a href="#reason-other-detail">{{ errors.reasonOther }}</a>
                </li>
                <li v-if="errors.appointmentDate">
                    <a href="#appointment-date">{{ errors.appointmentDate }}</a>
                </li>
                <li v-if="errors.appointmentTime">
                    <a href="#appointment-time">{{ errors.appointmentTime }}</a>
                </li>
                <li v-if="errors.fullName"><a href="#full-name">{{ errors.fullName }}</a></li>
                <li v-if="errors.email"><a href="#email">{{ errors.email }}</a></li>
                <li v-if="errors.confirmedAccurate">
                    <a href="#confirmed-accurate">{{ errors.confirmedAccurate }}</a>
                </li>
            </ul>
        </ErrorSummary>

        <template v-if="step === 0">
            <h2 id="step-heading" tabindex="-1" ref="stepHeadingRef">Before you start</h2>

            <WarningCallout label="Emergency notice">
                <p>If you have a medical emergency, call 999 or go to your nearest A&amp;E.</p>
            </WarningCallout>

            <p>
                Use this service to book a routine appointment with your GP surgery online.
                It takes about 5 minutes.
            </p>

            <InsetText
                >Appointments are available Monday to Friday, 8am to 6pm. Most requests are
                confirmed within 2 working days.</InsetText
            >

            <Details summary="What happens at your appointment">
                <p>
                    A clinician will review the reason you gave for the appointment and may
                    ask follow-up questions. Bring a list of any medicines you are currently
                    taking.
                </p>
            </Details>

            <p><Button @click="goToStep(1)">Start now</Button></p>
        </template>

        <template v-else-if="step === 1">
            <h2 id="step-heading" tabindex="-1" ref="stepHeadingRef">Reason for your appointment</h2>

            <Form label="Reason for your appointment" novalidate @submit="goNext(validateReason, 2)">
                <RadioGroup label="Why do you need an appointment?">
                    <Label>
                        <RadioInput
                            id="reason-routine"
                            label="Routine check-up"
                            name="reason"
                            value="routine"
                            :checked="reason === 'routine'"
                            @change="reason = 'routine'"
                        />
                        Routine check-up
                    </Label>
                    <Label>
                        <RadioInput
                            id="reason-follow-up"
                            label="Follow-up appointment"
                            name="reason"
                            value="follow-up"
                            :checked="reason === 'follow-up'"
                            @change="reason = 'follow-up'"
                        />
                        Follow-up appointment
                    </Label>
                    <Label>
                        <RadioInput
                            id="reason-vaccination"
                            label="Vaccination"
                            name="reason"
                            value="vaccination"
                            :checked="reason === 'vaccination'"
                            @change="reason = 'vaccination'"
                        />
                        Vaccination
                    </Label>
                    <Label>
                        <RadioInput
                            id="reason-other"
                            label="Something else"
                            name="reason"
                            value="other"
                            :checked="reason === 'other'"
                            @change="reason = 'other'"
                        />
                        Something else
                    </Label>
                </RadioGroup>
                <ErrorMessage v-if="errors.reason">{{ errors.reason }}</ErrorMessage>

                <template v-if="reason === 'other'">
                    <Field
                        label="Tell us more"
                        required
                        :error="errors.reasonOther"
                        inputId="reason-other-detail"
                    >
                        <TextAreaInput
                            id="reason-other-detail"
                            label="Tell us more about the reason for your appointment"
                            v-model="reasonOther"
                            :rows="4"
                            required
                        />
                    </Field>
                    <CharacterCounter :count="reasonOther.length" :max="250" label="Characters used" />
                </template>

                <p><Button type="submit">Continue</Button></p>
            </Form>
        </template>

        <template v-else-if="step === 2">
            <h2 id="step-heading" tabindex="-1" ref="stepHeadingRef">Choose a date and time</h2>

            <InsetText>Appointments are available Monday to Friday, 8am to 6pm.</InsetText>

            <Form label="Choose a date and time" novalidate @submit="goNext(validateDateTime, 3)">
                <Fieldset legend="Preferred date and time">
                    <Field
                        label="Preferred date"
                        required
                        :error="errors.appointmentDate"
                        inputId="appointment-date"
                    >
                        <Hint id="appointment-date-hint"
                            >We will try to match your preference, but availability may
                            vary.</Hint
                        >
                        <DateInput
                            id="appointment-date"
                            label="Preferred date"
                            v-model="appointmentDate"
                            :min="todayIso()"
                            required
                            aria-describedby="appointment-date-hint"
                        />
                    </Field>

                    <Field
                        label="Preferred time of day"
                        required
                        :error="errors.appointmentTime"
                        inputId="appointment-time"
                    >
                        <Select
                            id="appointment-time"
                            label="Preferred time of day"
                            v-model="appointmentTime"
                            required
                        >
                            <Option value="">Select a time of day</Option>
                            <Option value="morning">{{ TIME_LABELS.morning }}</Option>
                            <Option value="afternoon">{{ TIME_LABELS.afternoon }}</Option>
                            <Option value="evening">{{ TIME_LABELS.evening }}</Option>
                        </Select>
                    </Field>
                </Fieldset>

                <p style="display: flex; gap: var(--nhs-space-3);">
                    <Button type="button" @click="goBack(1)">Back</Button>
                    <Button type="submit">Continue</Button>
                </p>
            </Form>
        </template>

        <template v-else-if="step === 3">
            <h2 id="step-heading" tabindex="-1" ref="stepHeadingRef">Your details</h2>

            <Form label="Your details" novalidate @submit="goNext(validateDetails, 4)">
                <Field label="Full name" required :error="errors.fullName" inputId="full-name">
                    <TextInput id="full-name" label="Full name" v-model="fullName" required />
                </Field>

                <Field label="Email address" required :error="errors.email" inputId="email">
                    <Hint id="email-hint">We will use this to send your confirmation.</Hint>
                    <EmailInput
                        id="email"
                        label="Email address"
                        v-model="email"
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
                        v-model="phone"
                        aria-describedby="phone-hint"
                    />
                </Field>

                <p>
                    <Label>
                        <CheckboxInput
                            label="I need an interpreter or additional support"
                            v-model:checked="needsSupport"
                        />
                        I need an interpreter or additional support
                    </Label>
                </p>

                <p style="display: flex; gap: var(--nhs-space-3);">
                    <Button type="button" @click="goBack(2)">Back</Button>
                    <Button type="submit">Continue</Button>
                </p>
            </Form>
        </template>

        <template v-else-if="step === 4">
            <h2 id="step-heading" tabindex="-1" ref="stepHeadingRef">Check your answers</h2>

            <SummaryList label="Your appointment details">
                <SummaryListItem term="Reason">
                    {{ REASON_LABELS[reason] || "Not answered" }}
                    <template v-if="reason === 'other' && reasonOther">
                        <br /><span>{{ reasonOther }}</span>
                    </template>
                    <a href="#reason" @click.prevent="goToStep(1)"
                        >Change<span class="visually-hidden"> reason</span></a
                    >
                </SummaryListItem>
                <SummaryListItem term="Date">
                    {{ appointmentDate || "Not answered" }}
                    <a href="#date" @click.prevent="goToStep(2)"
                        >Change<span class="visually-hidden"> date</span></a
                    >
                </SummaryListItem>
                <SummaryListItem term="Time of day">
                    {{ appointmentTime ? TIME_LABELS[appointmentTime] : "Not answered" }}
                    <a href="#time" @click.prevent="goToStep(2)"
                        >Change<span class="visually-hidden"> time of day</span></a
                    >
                </SummaryListItem>
                <SummaryListItem term="Full name">
                    {{ fullName || "Not answered" }}
                    <a href="#name" @click.prevent="goToStep(3)"
                        >Change<span class="visually-hidden"> full name</span></a
                    >
                </SummaryListItem>
                <SummaryListItem term="Email address">
                    {{ email || "Not answered" }}
                    <a href="#email-review" @click.prevent="goToStep(3)"
                        >Change<span class="visually-hidden"> email address</span></a
                    >
                </SummaryListItem>
                <SummaryListItem term="Phone number">
                    <template v-if="phone">{{ phone }}</template>
                    <StatusTag v-else>Not provided</StatusTag>
                    <a href="#phone-review" @click.prevent="goToStep(3)"
                        >Change<span class="visually-hidden"> phone number</span></a
                    >
                </SummaryListItem>
                <SummaryListItem term="Interpreter or additional support">
                    {{ needsSupport ? "Yes" : "No" }}
                    <a href="#support-review" @click.prevent="goToStep(3)"
                        >Change<span class="visually-hidden"
                            > interpreter or additional support</span
                        ></a
                    >
                </SummaryListItem>
            </SummaryList>

            <Form label="Confirm and book your appointment" novalidate @submit="submitBooking">
                <p>
                    <Label>
                        <CheckboxInput
                            id="confirmed-accurate"
                            label="I confirm the information above is correct"
                            v-model:checked="confirmedAccurate"
                        />
                        I confirm the information above is correct
                    </Label>
                    <ErrorMessage v-if="errors.confirmedAccurate">{{ errors.confirmedAccurate }}</ErrorMessage>
                </p>

                <p style="display: flex; gap: var(--nhs-space-3);">
                    <Button type="button" @click="goBack(3)">Back</Button>
                    <Button type="submit">Confirm and book</Button>
                </p>
            </Form>
        </template>

        <template v-else-if="step === 5">
            <h2 id="step-heading" tabindex="-1" ref="stepHeadingRef">Booking confirmed</h2>

            <SuccessPanel label="Booking confirmed">
                <p>
                    Your appointment reference number is
                    <strong>{{ referenceNumber }}</strong>. We have sent a confirmation to
                    {{ email }}.
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
                    {{ appointmentTime ? TIME_LABELS[appointmentTime].toLowerCase() : "" }}
                    appointment on {{ appointmentDate }} by email. Keep your reference number
                    in case you need to change or cancel.
                </p>
            </Panel>

            <p><Button @click="startOver">Book another appointment</Button></p>
        </template>
    </main>

    <Footer label="Site footer">
        <div class="page-wrapper">
            <p>Lily Design System — Book an Appointment Example</p>
        </div>
    </Footer>
</template>

<style scoped>
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
