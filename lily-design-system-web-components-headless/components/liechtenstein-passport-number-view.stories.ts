import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./liechtenstein-passport-number-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/LiechtensteinPassportNumberView",
    render: (args) => h("lily-liechtenstein-passport-number-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Passport Number",
        "value": "R00536"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
