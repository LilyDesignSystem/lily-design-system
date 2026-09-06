import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./measurement-system-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Forms/MeasurementSystemInput",
    render: (args) => h("lily-measurement-system-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Measurement system",
        "value": "metric"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
