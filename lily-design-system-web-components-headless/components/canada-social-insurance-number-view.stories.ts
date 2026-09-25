import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./canada-social-insurance-number-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/CanadaSocialInsuranceNumberView",
    render: (args) => h("lily-canada-social-insurance-number-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Social Insurance Number (SIN)",
        "value": "123 456 782"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
