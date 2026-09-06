import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./net-promoter-score-picker-button.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Pickers/NetPromoterScorePickerButton",
    render: (args) => h("lily-net-promoter-score-picker-button", args as Record<string, string | boolean>, SLOT),
    args: {
        "value": "9",
        "label": "9"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
