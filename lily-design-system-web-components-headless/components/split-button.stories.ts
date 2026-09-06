import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./split-button.js";
import { h } from "../stories/render.js";

const SLOT = '<div role="menuitem">Save as draft</div><div role="menuitem">Save and close</div>';

const meta: Meta = {
    title: "Forms/SplitButton",
    render: (args) => h("lily-split-button", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Save options",
        "primary-label": "Save",
        "menu-label": "More save options",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
