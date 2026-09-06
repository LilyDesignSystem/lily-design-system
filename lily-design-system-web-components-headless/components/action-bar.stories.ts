import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./action-bar.js";
import "./action-bar-button.js";
import { h } from "../stories/render.js";

const SLOT = "<lily-action-bar-button label=\"Delete\">Delete</lily-action-bar-button>";

const meta: Meta = {
    title: "Navigation/ActionBar",
    render: (args) => h("lily-action-bar", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Bulk actions",
        "selected-count": "3",
        "selected-count-label": "3 selected",
        "clear-selection-label": "Clear selection"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
