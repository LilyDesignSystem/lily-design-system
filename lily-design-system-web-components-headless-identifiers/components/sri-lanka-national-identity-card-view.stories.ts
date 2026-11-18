import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./sri-lanka-national-identity-card-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/SriLankaNationalIdentityCardView",
    render: (args) =>
        h(
            "lily-sri-lanka-national-identity-card-view",
            args as Record<string, string | boolean>,
            SLOT,
        ),
    args: {
        label: "National Identity Card (NIC) number",
        value: "197419202757",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
