import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./observation-view.js";
import { h } from "../stories/render.js";

const SLOT = ``;

const meta: Meta = {
    title: "Healthcare/ObservationView",
    render: (args) => h("lily-observation-view", args as Record<string, string | boolean>, SLOT),
    args: {
        label: "Potassium",
        value: "5.9",
        unit: "mmol/L",
        interpretation: "H",
        "flag-label": "High",
        range: "3.5–5.3",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
