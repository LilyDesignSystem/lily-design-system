import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./malta-national-identification-number-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/MaltaNationalIdentificationNumberView",
    render: (args) => h("lily-malta-national-identification-number-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "National Identification Number",
        "value": "1234567M"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
