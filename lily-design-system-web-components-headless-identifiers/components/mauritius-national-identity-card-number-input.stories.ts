import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./mauritius-national-identity-card-number-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/MauritiusNationalIdentityCardNumberInput",
    render: (args) =>
        h(
            "lily-mauritius-national-identity-card-number-input",
            args as Record<string, string | boolean>,
            SLOT,
        ),
    args: {
        label: "National Identity Card number",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
