import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./tree-link.js";
import { h } from "../stories/render.js";

const SLOT = "src";

const meta: Meta = {
    title: "Links/TreeLink",
    render: (args) => h("lily-tree-link", args as Record<string, string | boolean>, SLOT),
    args: {
        "href": "#src"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
