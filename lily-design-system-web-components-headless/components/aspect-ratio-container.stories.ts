import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./aspect-ratio-container.js";
import { h } from "../stories/render.js";

const SLOT = "16:9 content area";

const meta: Meta = {
    title: "Content/AspectRatioContainer",
    render: (args) => h("lily-aspect-ratio-container", args as Record<string, string | boolean>, SLOT),
    args: {
        "ratio": "1.777",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
