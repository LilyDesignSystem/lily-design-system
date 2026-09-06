import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./slovensko-pas-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/SlovenskoPasInput",
    render: (args) => h("lily-slovensko-pas-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Pas"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
