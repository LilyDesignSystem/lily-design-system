import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./middle-truncation.js";
import { h } from "../stories/render.js";

const meta: Meta = {
    title: "Content/MiddleTruncation",
    render: (args) => h("lily-middle-truncation", args as Record<string, string | boolean>),
    args: {
        "text": "quarterly-report-final-version-3.pdf",
        "ellipsis": "…",
        "strategy": "min-end",
        "end": "6"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
