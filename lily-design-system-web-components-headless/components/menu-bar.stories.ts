import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./menu-bar.js";
import "./menu-bar-button.js";
import { h } from "../stories/render.js";

const SLOT =
    "<lily-menu-bar-button>File</lily-menu-bar-button>" +
    "<lily-menu-bar-button>Edit</lily-menu-bar-button>" +
    "<lily-menu-bar-button>View</lily-menu-bar-button>";

const meta: Meta = {
    title: "Navigation/MenuBar",
    render: (args) => h("lily-menu-bar", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Main menu"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
