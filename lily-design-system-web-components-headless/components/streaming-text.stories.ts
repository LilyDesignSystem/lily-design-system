import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./streaming-text.js";
import { h } from "../stories/render.js";

const SLOT = "Partial answer so far";

const meta: Meta = {
    title: "Media and data/StreamingText",
    render: (args) => h("lily-streaming-text", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "StreamingText"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
