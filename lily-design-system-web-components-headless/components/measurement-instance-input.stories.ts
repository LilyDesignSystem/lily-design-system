import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./measurement-instance-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Forms/MeasurementInstanceInput",
    render: (args) => h("lily-measurement-instance-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Weight",
        "value": "72 kg"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
