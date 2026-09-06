import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./mentions-input.js";
import { h } from "../stories/render.js";

const SLOT = '<ul role="listbox"><li role="option">@alice</li><li role="option">@bob</li></ul>';

const meta: Meta = {
    title: "Content/MentionsInput",
    render: (args) => h("lily-mentions-input", args as Record<string, string | boolean>, SLOT),
    args: {
        label: "Comment",
        placeholder: "Type @ to mention someone",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Expanded: Story = {
    args: { expanded: true, value: "Hello @" },
};
