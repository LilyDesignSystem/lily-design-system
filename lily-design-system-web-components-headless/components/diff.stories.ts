import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./diff.js";
import { h } from "../stories/render.js";

const SLOT = "<div>Before: the quick fox jumps.</div><div>After: the quick brown fox jumps.</div>";

const meta: Meta = {
    title: "Content/Diff",
    render: (args) => h("lily-diff", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Before and after comparison",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
