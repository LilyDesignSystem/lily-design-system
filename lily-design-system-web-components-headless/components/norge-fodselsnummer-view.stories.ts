import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./norge-fodselsnummer-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/NorgeFodselsnummerView",
    render: (args) => h("lily-norge-fodselsnummer-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Fødselsnummer",
        "value": "01129012345"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
