import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./file-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Forms/FileInput",
    render: (args) => h("lily-file-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Upload document"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
