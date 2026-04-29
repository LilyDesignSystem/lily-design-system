<script setup lang="ts">
import { ref, reactive } from "vue";

const data = reactive({
    name: "",
    email: "",
    subject: "general",
    message: "",
});
const errors = reactive<Record<string, string>>({});
const submitted = ref(false);

function validate(): boolean {
    Object.keys(errors).forEach((k) => delete errors[k]);
    if (!data.name.trim()) errors.name = "Name is required";
    if (!data.email.trim()) errors.email = "Email is required";
    else if (!data.email.includes("@")) errors.email = "Enter a valid email address";
    if (!data.message.trim()) errors.message = "Message is required";
    return Object.keys(errors).length === 0;
}

function handleSubmit() {
    if (validate()) {
        submitted.value = true;
    }
}
</script>

<template>
    <main class="page-wrapper">
        <div v-if="submitted" role="status">
            <p>Thank you, {{ data.name }}! Your message has been sent.</p>
        </div>
        <template v-else>
            <h1>Contact Us</h1>
            <Form label="Contact us" @submit="handleSubmit">
                <ErrorSummary v-if="Object.keys(errors).length > 0" title="Please fix the following errors">
                    <ul>
                        <li v-for="(msg, field) in errors" :key="field">
                            <a :href="`#${field}`">{{ msg }}</a>
                        </li>
                    </ul>
                </ErrorSummary>

                <Field label="Full name" required :error="errors.name">
                    <TextInput label="Full name" v-model="data.name" id="name" required />
                </Field>

                <Field label="Email address" required :error="errors.email">
                    <EmailInput label="Email address" v-model="data.email" id="email" required />
                </Field>

                <Field label="Subject">
                    <Select label="Subject" v-model="data.subject">
                        <Option value="general">General inquiry</Option>
                        <Option value="support">Technical support</Option>
                        <Option value="billing">Billing question</Option>
                        <Option value="feedback">Feedback</Option>
                    </Select>
                </Field>

                <Field label="Message" required :error="errors.message">
                    <TextAreaInput label="Message" v-model="data.message" id="message" :rows="5" required />
                </Field>

                <Button type="submit">Send Message</Button>
            </Form>
        </template>
    </main>
</template>
