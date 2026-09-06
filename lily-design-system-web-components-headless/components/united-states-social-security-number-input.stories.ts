import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./united-states-social-security-number-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/UnitedStatesSocialSecurityNumberInput",
    render: (args) => h("lily-united-states-social-security-number-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Social Security number"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
