import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./latvija-personas-kods-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/LatvijaPersonasKodsInput",
    render: (args) => h("lily-latvija-personas-kods-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Personas kods"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
