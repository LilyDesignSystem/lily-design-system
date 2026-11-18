import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./mauritius-national-identity-card-number-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/MauritiusNationalIdentityCardNumberView",
    render: (args) =>
        h(
            "lily-mauritius-national-identity-card-number-view",
            args as Record<string, string | boolean>,
            SLOT,
        ),
    args: {
        label: "National Identity Card number",
        value: "A0101801234567",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
