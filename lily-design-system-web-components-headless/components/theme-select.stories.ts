import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./theme-select.js";
import "./theme-select-option.js";
import { h } from "../stories/render.js";

const SLOT =
    '<lily-theme-select-option value="light">Light</lily-theme-select-option>' +
    '<lily-theme-select-option value="dark">Dark</lily-theme-select-option>' +
    '<lily-theme-select-option value="high-contrast">High contrast</lily-theme-select-option>';

const meta: Meta = {
    title: "Forms/ThemeSelect",
    render: (args) => h("lily-theme-select", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Theme",
        "value": "light",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
