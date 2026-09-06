import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./content-block.js";
import { h } from "../stories/render.js";

const SLOT = "<p>Content constrained to a named column width.</p>";

const meta: Meta = {
    title: "Content/ContentBlock",
    render: (args) => h("lily-content-block", args as Record<string, string | boolean>, SLOT),
    args: {
        "width": "normal",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
