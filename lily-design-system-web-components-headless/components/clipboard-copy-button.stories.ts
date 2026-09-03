import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./clipboard-copy-button.js";
import { h } from "../stories/render.js";

const SLOT = "Copy link";

const meta: Meta = {
    title: "Buttons and links/ClipboardCopyButton",
    render: (args) => h("lily-clipboard-copy-button", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Copy link",
        "text": "https://example.com"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
