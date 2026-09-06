import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./united-kingdom-national-insurance-number-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/UnitedKingdomNationalInsuranceNumberView",
    render: (args) => h("lily-united-kingdom-national-insurance-number-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "National Insurance number",
        "value": "AB123456C"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
