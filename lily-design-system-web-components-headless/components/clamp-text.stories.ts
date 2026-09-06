import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./clamp-text.js";
import { h } from "../stories/render.js";

const SLOT =
    "This is a long paragraph of text used to demonstrate line clamping across several lines of wrapped content.";

const meta: Meta = {
    title: "Content/ClampText",
    render: (args) => h("lily-clamp-text", args as Record<string, string | boolean>, SLOT),
    args: {
        "lines": "2",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
