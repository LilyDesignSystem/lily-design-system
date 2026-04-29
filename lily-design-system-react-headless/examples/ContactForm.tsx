// Example: Contact form with validation and error summary
//
// Demonstrates: Form, Field, TextInput, EmailInput, TextAreaInput, Button,
// ErrorSummary, ErrorMessage, Select, Option

import { useState } from "react";
import Form from "../components/Form";
import Field from "../components/Field";
import TextInput from "../components/TextInput";
import EmailInput from "../components/EmailInput";
import TextAreaInput from "../components/TextAreaInput";
import Select from "../components/Select";
import Option from "../components/Option";
import Button from "../components/Button";
import ErrorSummary from "../components/ErrorSummary";

interface FormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export default function ContactForm() {
    const [data, setData] = useState<FormData>({
        name: "",
        email: "",
        subject: "general",
        message: "",
    });
    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
    const [submitted, setSubmitted] = useState(false);

    function validate(): boolean {
        const newErrors: Partial<Record<keyof FormData, string>> = {};
        if (!data.name.trim()) newErrors.name = "Name is required";
        if (!data.email.trim()) newErrors.email = "Email is required";
        else if (!data.email.includes("@")) newErrors.email = "Enter a valid email address";
        if (!data.message.trim()) newErrors.message = "Message is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (validate()) {
            setSubmitted(true);
        }
    }

    if (submitted) {
        return (
            <div role="status">
                <p>Thank you, {data.name}! Your message has been sent.</p>
            </div>
        );
    }

    return (
        <Form label="Contact us" onSubmit={handleSubmit}>
            {Object.keys(errors).length > 0 && (
                <ErrorSummary title="Please fix the following errors">
                    <ul>
                        {Object.entries(errors).map(([field, msg]) => (
                            <li key={field}><a href={`#${field}`}>{msg}</a></li>
                        ))}
                    </ul>
                </ErrorSummary>
            )}

            <Field label="Full name" required error={errors.name}>
                <TextInput
                    label="Full name"
                    value={data.name}
                    onChange={(value) => setData({ ...data, name: value })}
                    id="name"
                    required
                />
            </Field>

            <Field label="Email address" required error={errors.email}>
                <EmailInput
                    label="Email address"
                    value={data.email}
                    onChange={(value) => setData({ ...data, email: value })}
                    id="email"
                    required
                />
            </Field>

            <Field label="Subject">
                <Select
                    label="Subject"
                    value={data.subject}
                    onChange={(value) => setData({ ...data, subject: value })}
                >
                    <Option value="general">General inquiry</Option>
                    <Option value="support">Technical support</Option>
                    <Option value="billing">Billing question</Option>
                    <Option value="feedback">Feedback</Option>
                </Select>
            </Field>

            <Field label="Message" required error={errors.message}>
                <TextAreaInput
                    label="Message"
                    value={data.message}
                    onChange={(value) => setData({ ...data, message: value })}
                    id="message"
                    rows={5}
                    required
                />
            </Field>

            <Button type="submit">Send Message</Button>
        </Form>
    );
}
