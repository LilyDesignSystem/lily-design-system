import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./loading.js";
import { h } from "../stories/render.js";

const SLOT = "<span>Loading dashboard...</span>";

const meta: Meta = {
    title: "Content/Loading",
    render: (args) => h("lily-loading", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Loading dashboard",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
