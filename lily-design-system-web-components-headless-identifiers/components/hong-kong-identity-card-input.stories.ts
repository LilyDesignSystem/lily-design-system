import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./hong-kong-identity-card-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/HongKongIdentityCardInput",
    render: (args) =>
        h("lily-hong-kong-identity-card-input", args as Record<string, string | boolean>, SLOT),
    args: {
        label: "Hong Kong Identity Card Number",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
