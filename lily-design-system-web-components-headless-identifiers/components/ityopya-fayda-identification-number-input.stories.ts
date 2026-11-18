import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./ityopya-fayda-identification-number-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/ItyopyaFaydaIdentificationNumberInput",
    render: (args) =>
        h(
            "lily-ityopya-fayda-identification-number-input",
            args as Record<string, string | boolean>,
            SLOT,
        ),
    args: {
        label: "Fayda Identification Number (FIN)",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
