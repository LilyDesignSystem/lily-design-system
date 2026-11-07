import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./net-promoter-score-picker.js";
import { h } from "../stories/render.js";

const meta: Meta = {
    title: "Pickers/NetPromoterScorePicker",
    render: (args) => h("lily-net-promoter-score-picker", args as Record<string, string | boolean>),
    args: {
        label: "How likely are you to recommend us?",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
