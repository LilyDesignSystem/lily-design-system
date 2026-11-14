import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./early-warning-score-view.js";
import { h } from "../stories/render.js";

const SLOT = ``;

const meta: Meta = {
    title: "Healthcare/EarlyWarningScoreView",
    render: (args) =>
        h("lily-early-warning-score-view", args as Record<string, string | boolean>, SLOT),
    args: {
        system: "NEWS2",
        score: "7",
        band: "high",
        "band-label": "High",
        escalation: "Urgent response",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
