import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./iban-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/IbanView",
    render: (args) => h("lily-iban-view", args as Record<string, string | boolean>, SLOT),
    args: {
        label: "IBAN",
        value: "GB82WEST12345698765432",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
