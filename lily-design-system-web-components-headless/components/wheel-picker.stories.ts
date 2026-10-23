import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./wheel-picker.js";
import { h } from "../stories/render.js";

const OPTIONS = '<option value="1">January</option><option value="2">February</option><option value="3">March</option>';

const meta: Meta = {
    title: "Forms/WheelPicker",
    render: (args) => h("lily-wheel-picker", args as Record<string, string | boolean>, OPTIONS),
    args: {
        "label": "Month",
        "value": "2"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
