import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./tool-bar.js";
import "./tool-bar-button.js";
import { h } from "../stories/render.js";

const SLOT = "<lily-tool-bar-button>Bold</lily-tool-bar-button><lily-tool-bar-button>Italic</lily-tool-bar-button><lily-tool-bar-button>Underline</lily-tool-bar-button><lily-tool-bar-button disabled>Strikethrough</lily-tool-bar-button>";

const meta: Meta = {
    title: "Navigation/ToolBar",
    render: (args) => h("lily-tool-bar", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Text formatting"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
