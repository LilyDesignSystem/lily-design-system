import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./red-orange-yellow-green-blue-picker.js";
import { h } from "../stories/render.js";

const meta: Meta = {
    title: "Pickers/RedOrangeYellowGreenBluePicker",
    render: (args) =>
        h("lily-red-orange-yellow-green-blue-picker", args as Record<string, string | boolean>),
    args: {
        label: "Risk level",
        "red-label": "Severe",
        "orange-label": "High",
        "yellow-label": "Medium",
        "green-label": "Low",
        "blue-label": "Informational",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
