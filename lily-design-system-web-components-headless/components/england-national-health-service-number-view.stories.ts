import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./england-national-health-service-number-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/EnglandNationalHealthServiceNumberView",
    render: (args) => h("lily-england-national-health-service-number-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "National Health Service Number",
        "value": "943 476 5919"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
