import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./measurement-unit-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Content/MeasurementUnitView",
    render: (args) => h("lily-measurement-unit-view", args as Record<string, string | boolean>, SLOT),
    args: {
        value: "kg",
        label: "Weight in kilograms",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
