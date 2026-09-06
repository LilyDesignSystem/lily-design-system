import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./affix.js";
import { h } from "../stories/render.js";

const SLOT = "Pinned content";

const meta: Meta = {
    title: "Content/Affix",
    render: (args) => h("lily-affix", args as Record<string, string | boolean>, SLOT),
    args: {
        "offset-top": "0",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
