import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./review-date.js";
import { h } from "../stories/render.js";

const SLOT = "June 15, 2025";

const meta: Meta = {
    title: "Content/ReviewDate",
    render: (args) => h("lily-review-date", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Next review",
        "datetime": "2025-06-15"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
