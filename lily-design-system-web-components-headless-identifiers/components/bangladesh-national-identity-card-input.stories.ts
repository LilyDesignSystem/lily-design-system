import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./bangladesh-national-identity-card-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/BangladeshNationalIdentityCardInput",
    render: (args) =>
        h(
            "lily-bangladesh-national-identity-card-input",
            args as Record<string, string | boolean>,
            SLOT,
        ),
    args: {
        label: "National ID (NID) number",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
