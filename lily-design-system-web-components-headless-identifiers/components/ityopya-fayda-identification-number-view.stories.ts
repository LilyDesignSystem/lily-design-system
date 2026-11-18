import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./ityopya-fayda-identification-number-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/ItyopyaFaydaIdentificationNumberView",
    render: (args) =>
        h(
            "lily-ityopya-fayda-identification-number-view",
            args as Record<string, string | boolean>,
            SLOT,
        ),
    args: {
        label: "Fayda Identification Number (FIN)",
        value: "123456789012",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
