import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./tree-nav.js";
import "./tree-list.js";
import { h } from "../stories/render.js";

const SLOT = '<lily-tree-list label="Docs sections"><li role="treeitem" tabindex="0" aria-expanded="true">Getting Started<ul role="group"><li role="treeitem" tabindex="-1">Installation</li><li role="treeitem" tabindex="-1">Quick Start</li></ul></li><li role="treeitem" tabindex="-1" aria-expanded="false">Components</li><li role="treeitem" tabindex="-1">API Reference</li></lily-tree-list>';

const meta: Meta = {
    title: "Navigation/TreeNav",
    render: (args) => h("lily-tree-nav", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Documentation sidebar"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
