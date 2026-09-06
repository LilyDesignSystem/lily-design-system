import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./sheet.js";
import { h } from "../stories/render.js";

const SLOT = "<p>Sheet content.</p>";

const meta: Meta = {
    title: "Content/Sheet",
    render: (args) => h("lily-sheet", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Settings",
        "side": "right",
        "open": true
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
