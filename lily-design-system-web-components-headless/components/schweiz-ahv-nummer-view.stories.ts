import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./schweiz-ahv-nummer-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/SchweizAhvNummerView",
    render: (args) => h("lily-schweiz-ahv-nummer-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "AHV-Nummer / Numéro AVS",
        "value": "756.1234.5678.97"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
