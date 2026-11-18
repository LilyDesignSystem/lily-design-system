import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./australia-tax-file-number-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/AustraliaTaxFileNumberView",
    render: (args) =>
        h("lily-australia-tax-file-number-view", args as Record<string, string | boolean>, SLOT),
    args: {
        label: "Tax File Number (TFN)",
        value: "123 456 782",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
