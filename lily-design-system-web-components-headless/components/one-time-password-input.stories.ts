import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./one-time-password-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Forms/OneTimePasswordInput",
    render: (args) => h("lily-one-time-password-input", args as Record<string, string | boolean>, SLOT),
    args: { "label": "Verification code", "length": "6" },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
