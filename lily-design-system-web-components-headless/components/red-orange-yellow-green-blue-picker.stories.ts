import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./red-orange-yellow-green-blue-picker.js";
import "./red-orange-yellow-green-blue-picker-button.js";
import { h } from "../stories/render.js";

const SLOT = [
    ["red", "Red - Critical"],
    ["orange", "Orange - Severe"],
    ["yellow", "Yellow - Caution"],
    ["green", "Green - Good"],
    ["blue", "Blue - Informational"],
]
    .map(
        ([value, label]) =>
            `<lily-red-orange-yellow-green-blue-picker-button value="${value}" label="${label}"></lily-red-orange-yellow-green-blue-picker-button>`,
    )
    .join("");

const meta: Meta = {
    title: "Pickers/RedOrangeYellowGreenBluePicker",
    render: (args) => h("lily-red-orange-yellow-green-blue-picker", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Sprint status"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
