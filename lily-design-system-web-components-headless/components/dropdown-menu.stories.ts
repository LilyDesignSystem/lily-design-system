import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./dropdown-menu.js";
import { h } from "../stories/render.js";

const SLOT =
    "<li role=\"menuitem\" tabindex=\"-1\">Edit</li><li role=\"menuitem\" tabindex=\"-1\">Duplicate</li><li role=\"menuitem\" tabindex=\"-1\">Delete</li>";

const meta: Meta = {
    title: "Navigation/DropdownMenu",
    render: (args) => h("lily-dropdown-menu", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Options",
        "open": true
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
