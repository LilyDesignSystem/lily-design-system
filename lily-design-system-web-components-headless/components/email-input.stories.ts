import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./email-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Forms/EmailInput",
    render: (args) => h("lily-email-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Email"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
