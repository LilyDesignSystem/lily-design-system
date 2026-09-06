import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./file-manager.js";
import { h } from "../stories/render.js";

const SLOT = "<ul><li>document.pdf</li><li>image.png</li><li>data.csv</li></ul>";

const meta: Meta = {
    title: "Content/FileManager",
    render: (args) => h("lily-file-manager", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Project files",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
