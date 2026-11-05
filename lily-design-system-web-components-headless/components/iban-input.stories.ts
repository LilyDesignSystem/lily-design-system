import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./iban-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/IbanInput",
    render: (args) => h("lily-iban-input", args as Record<string, string | boolean>, SLOT),
    args: {
        label: "IBAN",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
