import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./password-input-or-text-input-div.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Content/PasswordInputOrTextInputDiv",
    render: (args) => h("lily-password-input-or-text-input-div", args as Record<string, string | boolean>, SLOT),
    args: {
        label: "Password",
        "toggle-label": "Show password",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const WithoutToggle: Story = {
    args: { label: "Password", "show-toggle": "false" },
};
