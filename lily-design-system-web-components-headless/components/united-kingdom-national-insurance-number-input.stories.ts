import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./united-kingdom-national-insurance-number-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/UnitedKingdomNationalInsuranceNumberInput",
    render: (args) => h("lily-united-kingdom-national-insurance-number-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "National Insurance number"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
