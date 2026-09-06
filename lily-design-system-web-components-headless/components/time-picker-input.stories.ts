import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./time-picker-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Content/TimePickerInput",
    render: (args) => h("lily-time-picker-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Appointment time",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
