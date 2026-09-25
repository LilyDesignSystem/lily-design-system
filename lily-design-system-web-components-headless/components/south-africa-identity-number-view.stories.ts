import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./south-africa-identity-number-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/SouthAfricaIdentityNumberView",
    render: (args) => h("lily-south-africa-identity-number-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "South African Identity Number",
        "value": "9001015008086"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
