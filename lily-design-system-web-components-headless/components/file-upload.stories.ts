import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./file-upload.js";
import { h } from "../stories/render.js";

const meta: Meta = {
    title: "Content/FileUpload",
    render: (args) => h("lily-file-upload", args as Record<string, string | boolean>),
    args: {
        "label": "Upload files",
        "accept": ".pdf,.docx",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Multiple: Story = {
    args: {
        "label": "Upload images",
        "accept": "image/*",
        "multiple": true,
    },
};
