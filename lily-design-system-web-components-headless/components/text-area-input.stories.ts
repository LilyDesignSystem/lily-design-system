import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./text-area-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Forms/TextAreaInput",
    render: (args) => h("lily-text-area-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Comments",
        "rows": "4",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
