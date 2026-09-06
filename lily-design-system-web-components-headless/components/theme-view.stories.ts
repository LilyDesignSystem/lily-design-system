import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./theme-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Content/ThemeView",
    render: (args) => h("lily-theme-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Current theme",
        "value": "dark",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
