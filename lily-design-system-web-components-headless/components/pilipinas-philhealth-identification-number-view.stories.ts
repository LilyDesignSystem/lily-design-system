import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./pilipinas-philhealth-identification-number-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/PilipinasPhilhealthIdentificationNumberView",
    render: (args) => h("lily-pilipinas-philhealth-identification-number-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "PhilHealth Identification Number (PIN)",
        "value": "12-345678901-2"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
