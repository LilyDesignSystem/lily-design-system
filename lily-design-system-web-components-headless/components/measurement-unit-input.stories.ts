import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./measurement-unit-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Forms/MeasurementUnitInput",
    render: (args) => h("lily-measurement-unit-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Unit",
        "value": "kg"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
