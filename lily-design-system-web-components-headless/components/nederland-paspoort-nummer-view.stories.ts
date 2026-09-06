import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./nederland-paspoort-nummer-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/NederlandPaspoortNummerView",
    render: (args) => h("lily-nederland-paspoort-nummer-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Paspoort Nummer",
        "value": "NR1234567"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
