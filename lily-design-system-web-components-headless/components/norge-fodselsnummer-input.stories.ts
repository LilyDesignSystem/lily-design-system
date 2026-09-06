import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./norge-fodselsnummer-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/NorgeFodselsnummerInput",
    render: (args) => h("lily-norge-fodselsnummer-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Fødselsnummer"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
