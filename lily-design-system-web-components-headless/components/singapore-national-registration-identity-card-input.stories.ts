import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./singapore-national-registration-identity-card-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/SingaporeNationalRegistrationIdentityCardInput",
    render: (args) => h("lily-singapore-national-registration-identity-card-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
