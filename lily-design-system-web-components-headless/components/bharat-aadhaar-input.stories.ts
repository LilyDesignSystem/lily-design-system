import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./bharat-aadhaar-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/BharatAadhaarInput",
    render: (args) => h("lily-bharat-aadhaar-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Aadhaar (आधार)"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
