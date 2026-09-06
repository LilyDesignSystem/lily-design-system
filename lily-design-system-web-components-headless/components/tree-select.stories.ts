import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./tree-select.js";
import { h } from "../stories/render.js";

const SLOT = '<ul role="tree"><li role="treeitem">Cardiology</li><li role="treeitem">Radiology</li></ul>';

const meta: Meta = {
    title: "Content/TreeSelect",
    render: (args) => h("lily-tree-select", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Select category",
        "placeholder": "Choose…",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
