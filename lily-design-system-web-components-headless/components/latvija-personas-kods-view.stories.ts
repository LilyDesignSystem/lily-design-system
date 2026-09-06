import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./latvija-personas-kods-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/LatvijaPersonasKodsView",
    render: (args) => h("lily-latvija-personas-kods-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Personas kods",
        "value": "090482-11234"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
