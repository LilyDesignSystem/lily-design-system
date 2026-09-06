import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./date-time-local-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Forms/DateTimeLocalInput",
    render: (args) => h("lily-date-time-local-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Appointment"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
