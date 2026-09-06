import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./bulgaria-edinen-grazhdanski-nomer-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/BulgariaEdinenGrazhdanskiNomerInput",
    render: (args) => h("lily-bulgaria-edinen-grazhdanski-nomer-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Edinen Grazhdanski Nomer"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
