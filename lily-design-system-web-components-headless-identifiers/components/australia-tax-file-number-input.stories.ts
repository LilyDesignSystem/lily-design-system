import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./australia-tax-file-number-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/AustraliaTaxFileNumberInput",
    render: (args) =>
        h("lily-australia-tax-file-number-input", args as Record<string, string | boolean>, SLOT),
    args: {
        label: "Tax File Number (TFN)",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
