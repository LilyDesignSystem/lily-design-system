import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./address-input.js";
import { h } from "../stories/render.js";

const SLOT =
    '<label for="street">Street</label><input id="street" autocomplete="address-line1">' +
    '<label for="postcode">Postal code</label><input id="postcode" autocomplete="postal-code">';

const meta: Meta = {
    title: "Forms/AddressInput",
    render: (args) => h("lily-address-input", args as Record<string, string | boolean>, SLOT),
    args: {
        label: "Delivery address",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
