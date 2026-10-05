import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./kbd-shortcut.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Content/KbdShortcut",
    render: (args) => h("lily-kbd-shortcut", args as Record<string, string | boolean>, SLOT),
    args: { "keys": "[\"Ctrl\",\"K\"]", "label": "Control K" },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
