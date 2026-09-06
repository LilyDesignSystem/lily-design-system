import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./tag-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Content/TagInput",
    render: (args) => h("lily-tag-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Add a skill",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
