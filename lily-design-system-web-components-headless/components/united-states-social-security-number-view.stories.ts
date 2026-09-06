import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./united-states-social-security-number-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/UnitedStatesSocialSecurityNumberView",
    render: (args) => h("lily-united-states-social-security-number-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Social Security number",
        "value": "123-45-6789"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
