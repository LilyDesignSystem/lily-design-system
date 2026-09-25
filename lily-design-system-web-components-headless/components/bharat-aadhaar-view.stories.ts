import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./bharat-aadhaar-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/BharatAadhaarView",
    render: (args) => h("lily-bharat-aadhaar-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Aadhaar (आधार)",
        "value": "234567890123"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
