import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./canada-social-insurance-number-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/CanadaSocialInsuranceNumberInput",
    render: (args) => h("lily-canada-social-insurance-number-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Social Insurance Number (SIN)"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
