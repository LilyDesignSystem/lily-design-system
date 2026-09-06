import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./nederland-paspoort-nummer-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/NederlandPaspoortNummerInput",
    render: (args) => h("lily-nederland-paspoort-nummer-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Paspoort Nummer"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
