import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./kypros-national-passport-number-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/KyprosNationalPassportNumberInput",
    render: (args) => h("lily-kypros-national-passport-number-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "National Passport Number"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
