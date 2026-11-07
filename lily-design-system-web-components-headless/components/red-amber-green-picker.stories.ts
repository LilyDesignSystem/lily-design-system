import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./red-amber-green-picker.js";
import { h } from "../stories/render.js";

const meta: Meta = {
    title: "Pickers/RedAmberGreenPicker",
    render: (args) => h("lily-red-amber-green-picker", args as Record<string, string | boolean>),
    args: {
        label: "Project status",
        "red-label": "Off track",
        "amber-label": "At risk",
        "green-label": "On track",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
