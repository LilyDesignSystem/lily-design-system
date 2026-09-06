import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./island-kennitala-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/IslandKennitalaInput",
    render: (args) => h("lily-island-kennitala-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Kennitala"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
