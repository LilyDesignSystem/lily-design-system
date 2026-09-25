import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./schweiz-ahv-nummer-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/SchweizAhvNummerInput",
    render: (args) => h("lily-schweiz-ahv-nummer-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "AHV-Nummer / Numéro AVS"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
