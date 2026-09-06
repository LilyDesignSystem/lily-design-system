import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./slovensko-pas-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/SlovenskoPasView",
    render: (args) => h("lily-slovensko-pas-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Pas",
        "value": "AB1234567"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
