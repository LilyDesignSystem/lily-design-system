import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./south-africa-identity-number-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/SouthAfricaIdentityNumberInput",
    render: (args) => h("lily-south-africa-identity-number-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "South African Identity Number"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
