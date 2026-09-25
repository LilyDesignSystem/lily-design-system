import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./rossiya-snils-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/RossiyaSnilsInput",
    render: (args) => h("lily-rossiya-snils-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "СНИЛС (SNILS)"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
