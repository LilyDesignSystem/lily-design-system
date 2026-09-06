import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./password-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Forms/PasswordInput",
    render: (args) => h("lily-password-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Password"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
