import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./file-tree.js";
import { h } from "../stories/render.js";

const SLOT = '<li role="treeitem" aria-expanded="true">src<ul role="group"><li role="treeitem">app.ts</li></ul></li><li role="treeitem">readme.md</li>';

const meta: Meta = {
    title: "Lists/FileTree",
    render: (args) => h("lily-file-tree", args as Record<string, string | boolean>, SLOT),
    args: { "label": "Files" },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
