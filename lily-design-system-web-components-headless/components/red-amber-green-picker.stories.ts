import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./red-amber-green-picker.js";
import "./red-amber-green-picker-button.js";
import { h } from "../stories/render.js";

const SLOT = [
    ["red", "Red - Critical"],
    ["amber", "Amber - Caution"],
    ["green", "Green - On track"],
]
    .map(([value, label]) => `<lily-red-amber-green-picker-button value="${value}" label="${label}"></lily-red-amber-green-picker-button>`)
    .join("");

const meta: Meta = {
    title: "Pickers/RedAmberGreenPicker",
    render: (args) => h("lily-red-amber-green-picker", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Project status"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
