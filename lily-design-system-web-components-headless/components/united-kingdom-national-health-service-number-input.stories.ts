import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./united-kingdom-national-health-service-number-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/UnitedKingdomNationalHealthServiceNumberInput",
    render: (args) => h("lily-united-kingdom-national-health-service-number-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "NHS number"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
