import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./net-promoter-score-picker.js";
import "./net-promoter-score-picker-button.js";
import { h } from "../stories/render.js";

const SLOT = Array.from(
    { length: 11 },
    (_, score) => `<lily-net-promoter-score-picker-button value="${score}" label="${score}"></lily-net-promoter-score-picker-button>`,
).join("");

const meta: Meta = {
    title: "Pickers/NetPromoterScorePicker",
    render: (args) => h("lily-net-promoter-score-picker", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "How likely are you to recommend us?"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
