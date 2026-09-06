import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./email-link.js";
import { h } from "../stories/render.js";

const meta: Meta = {
    title: "Links/EmailLink",
    render: (args) => h("lily-email-link", args as Record<string, string | boolean>),
    args: {
        "email": "alice@example.com"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
