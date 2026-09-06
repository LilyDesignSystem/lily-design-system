import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./england-national-health-service-number-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/EnglandNationalHealthServiceNumberInput",
    render: (args) => h("lily-england-national-health-service-number-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "National Health Service Number"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
