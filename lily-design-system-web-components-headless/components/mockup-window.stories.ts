import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./mockup-window.js";
import { h } from "../stories/render.js";

const SLOT = "<p>Settings</p>";

const meta: Meta = {
    title: "Content/MockupWindow",
    render: (args) => h("lily-mockup-window", args as Record<string, string | boolean>, SLOT),
    args: {
        label: "Preview of the settings window",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
