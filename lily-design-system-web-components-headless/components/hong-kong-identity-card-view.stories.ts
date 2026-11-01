import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./hong-kong-identity-card-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/HongKongIdentityCardView",
    render: (args) =>
        h("lily-hong-kong-identity-card-view", args as Record<string, string | boolean>, SLOT),
    args: {
        label: "Hong Kong Identity Card Number",
        value: "A123456(3)",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
