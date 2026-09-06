import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./file-dialog.js";
import { h } from "../stories/render.js";

const SLOT = '<ul><li>report.pdf</li><li>photo.jpg</li></ul>';

const meta: Meta = {
    title: "Overlays/FileDialog",
    render: (args) => h("lily-file-dialog", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Choose a file",
        "open": true
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
