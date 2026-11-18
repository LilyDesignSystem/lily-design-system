import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./nigeria-national-identification-number-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/NigeriaNationalIdentificationNumberInput",
    render: (args) =>
        h(
            "lily-nigeria-national-identification-number-input",
            args as Record<string, string | boolean>,
            SLOT,
        ),
    args: {
        label: "National Identification Number (NIN)",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
