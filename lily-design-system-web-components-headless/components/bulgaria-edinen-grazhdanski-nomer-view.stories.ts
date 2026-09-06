import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./bulgaria-edinen-grazhdanski-nomer-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/BulgariaEdinenGrazhdanskiNomerView",
    render: (args) => h("lily-bulgaria-edinen-grazhdanski-nomer-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Edinen Grazhdanski Nomer",
        "value": "7523169263"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
