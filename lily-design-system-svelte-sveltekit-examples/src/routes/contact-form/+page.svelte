<script lang="ts">
    import Form from "$lib/components/Form.svelte";
    import Field from "$lib/components/Field.svelte";
    import TextInput from "$lib/components/TextInput.svelte";
    import EmailInput from "$lib/components/EmailInput.svelte";
    import TelInput from "$lib/components/TelInput.svelte";
    import TextAreaInput from "$lib/components/TextAreaInput.svelte";
    import Select from "$lib/components/Select.svelte";
    import Option from "$lib/components/Option.svelte";
    import CheckboxInput from "$lib/components/CheckboxInput.svelte";
    import RadioGroup from "$lib/components/RadioGroup.svelte";
    import RadioInput from "$lib/components/RadioInput.svelte";
    import ErrorMessage from "$lib/components/ErrorMessage.svelte";
    import ErrorSummary from "$lib/components/ErrorSummary.svelte";
    import Button from "$lib/components/Button.svelte";
    import SubmitInput from "$lib/components/SubmitInput.svelte";
    import ResetInput from "$lib/components/ResetInput.svelte";
    import Hint from "$lib/components/Hint.svelte";
    import Label from "$lib/components/Label.svelte";
    import Fieldset from "$lib/components/Fieldset.svelte";
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import BackLink from "$lib/components/BackLink.svelte";

    let name = $state("");
    let email = $state("");
    let phone = $state("");
    let subject = $state("");
    let message = $state("");
    let contactMethod = $state("email");
    let agreeTerms = $state(false);
    let errors: Record<string, string> = $state({});
    let submitted = $state(false);

    function validate(): boolean {
        const newErrors: Record<string, string> = {};
        if (!name.trim()) newErrors.name = "Enter your full name";
        if (!email.trim()) newErrors.email = "Enter your email address";
        if (!message.trim()) newErrors.message = "Enter your message";
        if (!agreeTerms) newErrors.terms = "You must agree to the terms";
        errors = newErrors;
        return Object.keys(newErrors).length === 0;
    }

    function handleSubmit() {
        if (validate()) {
            submitted = true;
        }
    }

    function handleReset() {
        name = "";
        email = "";
        phone = "";
        subject = "";
        message = "";
        contactMethod = "email";
        agreeTerms = false;
        errors = {};
        submitted = false;
    }
</script>

<Header label="Site header">
    <div class="page-wrapper">
        <h1>Contact Form</h1>
    </div>
</Header>

<main class="page-wrapper">
    <BackLink href="/">Back to examples</BackLink>

    {#if submitted}
        <div class="panel">
            <h2>Thank you</h2>
            <p>
                Your message has been sent. We will respond via {contactMethod}.
            </p>
            <Button onclick={handleReset}>Send another message</Button>
        </div>
    {:else}
        {#if Object.keys(errors).length > 0}
            <ErrorSummary title="There is a problem">
                <ul>
                    {#each Object.entries(errors) as [key, msg]}
                        <li><a href="#{key}">{msg}</a></li>
                    {/each}
                </ul>
            </ErrorSummary>
        {/if}

        <Form
            label="Contact form"
            onsubmit={handleSubmit}
            onreset={handleReset}
        >
            <Field label="Full name" required error={errors.name}>
                <TextInput
                    label="Full name"
                    bind:value={name}
                    required
                    id="name"
                />
            </Field>

            <Field label="Email address" required error={errors.email}>
                <Hint>We will use this to reply to your message</Hint>
                <EmailInput
                    label="Email address"
                    bind:value={email}
                    required
                    id="email"
                />
            </Field>

            <Field label="Phone number">
                <Hint
                    >Optional — include country code for international numbers</Hint
                >
                <TelInput label="Phone number" bind:value={phone} id="phone" />
            </Field>

            <Field label="Subject">
                <Select label="Subject" bind:value={subject}>
                    <Option value="">Select a subject</Option>
                    <Option value="general">General enquiry</Option>
                    <Option value="feedback">Feedback</Option>
                    <Option value="support">Technical support</Option>
                    <Option value="other">Other</Option>
                </Select>
            </Field>

            <Field label="Message" required error={errors.message}>
                <TextAreaInput
                    label="Your message"
                    bind:value={message}
                    required
                    id="message"
                />
            </Field>

            <Fieldset legend="Preferred contact method">
                <RadioGroup label="How should we contact you?">
                    <div
                        style="display: flex; flex-direction: column; gap: 0.5rem;"
                    >
                        <label
                            style="display: flex; align-items: center; gap: 0.5rem;"
                        >
                            <RadioInput
                                label="Email"
                                name="contactMethod"
                                value="email"
                                checked={contactMethod === "email"}
                            />
                            Email
                        </label>
                        <label
                            style="display: flex; align-items: center; gap: 0.5rem;"
                        >
                            <RadioInput
                                label="Phone"
                                name="contactMethod"
                                value="phone"
                                checked={contactMethod === "phone"}
                            />
                            Phone
                        </label>
                    </div>
                </RadioGroup>
            </Fieldset>

            <div style="margin-bottom: var(--nhs-space-4);">
                <label style="display: flex; align-items: center; gap: 0.5rem;">
                    <CheckboxInput
                        label="I agree to the terms and conditions"
                        bind:checked={agreeTerms}
                        id="terms"
                    />
                    I agree to the terms and conditions
                </label>
                {#if errors.terms}
                    <ErrorMessage>{errors.terms}</ErrorMessage>
                {/if}
            </div>

            <div style="display: flex; gap: var(--nhs-space-3);">
                <SubmitInput value="Send message" />
                <ResetInput value="Clear form" />
            </div>
        </Form>
    {/if}
</main>

<Footer label="Site footer">
    <div class="page-wrapper">
        <p>Lily Design System — Contact Form Example</p>
    </div>
</Footer>
