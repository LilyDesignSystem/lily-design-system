import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./multi-select-with-extras.js";
import { h } from "../stories/render.js";

const SLOT = '<span slot="before">Tags</span><option value="a">A</option><option value="b">B</option>';

const meta: Meta = {
    title: "Forms/MultiSelectWithExtras",
    render: (args) => h("lily-multi-select-with-extras", args as Record<string, string | boolean>, SLOT),
    args: { "label": "Tags" },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
