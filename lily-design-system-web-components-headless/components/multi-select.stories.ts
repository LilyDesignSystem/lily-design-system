import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./multi-select.js";
import { h } from "../stories/render.js";

const SLOT = '<option value="a">A</option><option value="b">B</option>';

const meta: Meta = {
    title: "Forms/MultiSelect",
    render: (args) => h("lily-multi-select", args as Record<string, string | boolean>, SLOT),
    args: { "label": "Tags" },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
