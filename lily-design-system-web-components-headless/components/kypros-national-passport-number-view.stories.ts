import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./kypros-national-passport-number-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/KyprosNationalPassportNumberView",
    render: (args) => h("lily-kypros-national-passport-number-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "National Passport Number",
        "value": "K12345678"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
