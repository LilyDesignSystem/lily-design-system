import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./hover-card.js";
import { h } from "../stories/render.js";

const SLOT = "<strong>Jane Doe</strong><p>Software Engineer at Acme Corp</p>";

const meta: Meta = {
    title: "Content/HoverCard",
    render: (args) => h("lily-hover-card", args as Record<string, string | boolean>, SLOT),
    args: {
        "open": true,
        "label": "Profile preview for jdoe",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Closed: Story = {
    args: {
        "open": false,
    },
};
