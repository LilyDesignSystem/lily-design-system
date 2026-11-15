import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./color-radio-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Forms/ColorRadioInput",
    render: (args) => h("lily-color-radio-input", args as Record<string, string | boolean>, SLOT),
    args: {
        label: "Email",
        name: "delivery",
        value: "email",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
