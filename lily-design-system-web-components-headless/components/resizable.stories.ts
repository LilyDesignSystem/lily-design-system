import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./resizable.js";
import { h } from "../stories/render.js";

const SLOT = "<p>Resizable panel content.</p>";

const meta: Meta = {
    title: "Content/Resizable",
    render: (args) => h("lily-resizable", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Resizable panel",
        "direction": "both"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
