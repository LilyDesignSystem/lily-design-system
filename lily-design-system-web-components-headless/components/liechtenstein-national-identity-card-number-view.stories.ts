import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./liechtenstein-national-identity-card-number-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/LiechtensteinNationalIdentityCardNumberView",
    render: (args) => h("lily-liechtenstein-national-identity-card-number-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "National Identity Card Number",
        "value": "ID022143586"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
