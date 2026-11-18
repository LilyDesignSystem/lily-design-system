import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./bangladesh-national-identity-card-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/BangladeshNationalIdentityCardView",
    render: (args) =>
        h(
            "lily-bangladesh-national-identity-card-view",
            args as Record<string, string | boolean>,
            SLOT,
        ),
    args: {
        label: "National ID (NID) number",
        value: "1234567890",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
