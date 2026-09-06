import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./progress-spinner.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Content/ProgressSpinner",
    render: (args) => h("lily-progress-spinner", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Loading data"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
