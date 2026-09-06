import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./nederland-identiteitskaart-nummer-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/NederlandIdentiteitskaartNummerView",
    render: (args) => h("lily-nederland-identiteitskaart-nummer-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Identiteitskaart Nummer",
        "value": "PX1234567"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
