import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./malta-national-identification-number-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/MaltaNationalIdentificationNumberInput",
    render: (args) => h("lily-malta-national-identification-number-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "National Identification Number"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
