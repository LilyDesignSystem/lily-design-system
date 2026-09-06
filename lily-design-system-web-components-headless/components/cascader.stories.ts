import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./cascader.js";
import { h } from "../stories/render.js";

const SLOT = "<ul role=\"tree\"><li>England</li><li>Scotland</li><li>Wales</li></ul>";

const meta: Meta = {
    title: "Content/Cascader",
    render: (args) => h("lily-cascader", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Region",
        "placeholder": "Select…",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
