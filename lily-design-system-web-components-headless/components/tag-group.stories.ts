import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./tag-group.js";
import { h } from "../stories/render.js";

const SLOT = '<span class="tag">CSS</span><span class="tag">Accessibility</span><span class="tag">Headless</span>';

const meta: Meta = {
    title: "Forms/TagGroup",
    render: (args) => h("lily-tag-group", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Skills",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
