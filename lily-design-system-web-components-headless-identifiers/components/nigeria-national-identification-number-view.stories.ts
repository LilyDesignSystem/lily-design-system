import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./nigeria-national-identification-number-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/NigeriaNationalIdentificationNumberView",
    render: (args) =>
        h(
            "lily-nigeria-national-identification-number-view",
            args as Record<string, string | boolean>,
            SLOT,
        ),
    args: {
        label: "National Identification Number (NIN)",
        value: "12345678901",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
