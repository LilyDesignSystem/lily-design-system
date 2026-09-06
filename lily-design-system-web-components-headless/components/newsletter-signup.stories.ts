import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./newsletter-signup.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Forms/NewsletterSignup",
    render: (args) => h("lily-newsletter-signup", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Newsletter signup",
        "heading": "Stay in the loop",
        "description": "Monthly updates, no spam.",
        "email-label": "Email",
        "email-placeholder": "you@example.com",
        "submit-label": "Subscribe",
        "success-message": "Thanks! Check your inbox to confirm.",
        "error-message": "Something went wrong. Please try again."
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
