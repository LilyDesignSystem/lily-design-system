import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./field.js";
import { h } from "../stories/render.js";

const SLOT = '<input type="email" />';

const meta: Meta = {
    title: "Content/Field",
    render: (args) => h("lily-field", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Email",
        "description": "We'll only use this to contact you about your account.",
        "required": true,
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const WithError: Story = {
    args: {
        "label": "Email",
        "error": "Enter a valid email address",
        "required": true,
    },
};
