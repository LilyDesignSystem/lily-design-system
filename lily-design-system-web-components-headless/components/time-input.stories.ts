import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./time-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Forms/TimeInput",
    render: (args) => h("lily-time-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Appointment time",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
