import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./pakistan-computerized-national-identity-card-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/PakistanComputerizedNationalIdentityCardView",
    render: (args) =>
        h(
            "lily-pakistan-computerized-national-identity-card-view",
            args as Record<string, string | boolean>,
            SLOT,
        ),
    args: {
        label: "Computerized National Identity Card Number (CNIC)",
        value: "35202-1234567-1",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
