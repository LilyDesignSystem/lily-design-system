import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./liechtenstein-national-identity-card-number-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/LiechtensteinNationalIdentityCardNumberInput",
    render: (args) => h("lily-liechtenstein-national-identity-card-number-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "National Identity Card Number"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
