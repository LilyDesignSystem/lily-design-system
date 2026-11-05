import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./tag-input-div.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Content/TagInputDiv",
    render: (args) => h("lily-tag-input-div", args as Record<string, string | boolean>, SLOT),
    args: {
        label: "Add a skill",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
