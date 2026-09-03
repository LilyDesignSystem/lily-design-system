import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./back-link.js";
import { h } from "../stories/render.js";

const SLOT = "Back";

const meta: Meta = {
    title: "Buttons and links/BackLink",
    render: (args) => h("lily-back-link", args as Record<string, string | boolean>, SLOT),
    args: {
        "href": "/previous"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
