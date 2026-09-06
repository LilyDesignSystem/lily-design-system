import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./nederland-identiteitskaart-nummer-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/NederlandIdentiteitskaartNummerInput",
    render: (args) => h("lily-nederland-identiteitskaart-nummer-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Identiteitskaart Nummer"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
