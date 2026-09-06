import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./image-file-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Forms/ImageFileInput",
    render: (args) => h("lily-image-file-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Profile photo"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
