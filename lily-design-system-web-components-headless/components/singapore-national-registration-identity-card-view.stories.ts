import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./singapore-national-registration-identity-card-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/SingaporeNationalRegistrationIdentityCardView",
    render: (args) => h("lily-singapore-national-registration-identity-card-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)",
        "value": "S1234567D"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
