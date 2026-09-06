import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./contents-link.js";
import { h } from "../stories/render.js";

const SLOT = "Introduction";

const meta: Meta = {
    title: "Links/ContentsLink",
    render: (args) => h("lily-contents-link", args as Record<string, string | boolean>, SLOT),
    args: {
        "href": "#introduction"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
