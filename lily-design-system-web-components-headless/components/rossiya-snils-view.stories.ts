import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./rossiya-snils-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/RossiyaSnilsView",
    render: (args) => h("lily-rossiya-snils-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "СНИЛС (SNILS)",
        "value": "112-233-445 95"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
