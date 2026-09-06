import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./malta-passport-number-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/MaltaPassportNumberView",
    render: (args) => h("lily-malta-passport-number-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Passport Number",
        "value": "1234567"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
