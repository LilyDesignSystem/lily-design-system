import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./menu-group.js";
import { h } from "../stories/render.js";

const SLOT = "<div role=\"menuitem\">Open</div><div role=\"menuitem\">Save</div>";

const meta: Meta = {
    title: "Forms/MenuGroup",
    render: (args) => h("lily-menu-group", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "File"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
