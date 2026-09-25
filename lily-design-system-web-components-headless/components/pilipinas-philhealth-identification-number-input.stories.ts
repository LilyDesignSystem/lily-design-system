import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./pilipinas-philhealth-identification-number-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/PilipinasPhilhealthIdentificationNumberInput",
    render: (args) => h("lily-pilipinas-philhealth-identification-number-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "PhilHealth Identification Number (PIN)"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
