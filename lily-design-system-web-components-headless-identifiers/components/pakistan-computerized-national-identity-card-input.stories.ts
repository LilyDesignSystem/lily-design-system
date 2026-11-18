import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./pakistan-computerized-national-identity-card-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/PakistanComputerizedNationalIdentityCardInput",
    render: (args) =>
        h(
            "lily-pakistan-computerized-national-identity-card-input",
            args as Record<string, string | boolean>,
            SLOT,
        ),
    args: {
        label: "Computerized National Identity Card Number (CNIC)",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
