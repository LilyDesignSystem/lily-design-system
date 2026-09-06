import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./menu.js";
import { h } from "../stories/render.js";

const SLOT =
    '<div role="menuitem" tabindex="0">Cut</div>' +
    '<div role="menuitem" tabindex="-1">Copy</div>' +
    '<div role="menuitem" tabindex="-1">Paste</div>';

const meta: Meta = {
    title: "Navigation/Menu",
    render: (args) => h("lily-menu", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Actions"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
