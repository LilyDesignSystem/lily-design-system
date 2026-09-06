import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./chat-list.js";

import { h } from "../stories/render.js";

const SLOT = "<li>Hello!</li><li>How can I help?</li>";

const meta: Meta = {
    title: "Lists/ChatList",
    render: (args) => h("lily-chat-list", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Conversation",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
