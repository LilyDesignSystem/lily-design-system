import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./malta-passport-number-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/MaltaPassportNumberInput",
    render: (args) => h("lily-malta-passport-number-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Passport Number"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
