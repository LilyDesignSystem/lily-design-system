import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./draft.js";
import { h } from "../stories/render.js";

const SLOT = "<p>This report is still a work in progress.</p>";

const meta: Meta = {
    title: "Content/Draft",
    render: (args) => h("lily-draft", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Draft report",
        "status": "in-progress",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
