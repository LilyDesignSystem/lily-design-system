import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./sri-lanka-national-identity-card-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/SriLankaNationalIdentityCardInput",
    render: (args) =>
        h(
            "lily-sri-lanka-national-identity-card-input",
            args as Record<string, string | boolean>,
            SLOT,
        ),
    args: {
        label: "National Identity Card (NIC) number",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
