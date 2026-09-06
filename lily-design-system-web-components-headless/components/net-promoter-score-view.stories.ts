import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./net-promoter-score-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Content/NetPromoterScoreView",
    render: (args) => h("lily-net-promoter-score-view", args as Record<string, string | boolean>, SLOT),
    args: {
        label: "NPS score",
        value: "9",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
