import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./chat-message.js";
import { h } from "../stories/render.js";

const SLOT = "<p>Author: Alex</p><time datetime=\"2026-09-04T10:00\">10:00</time><p>Hey, are we still on for today?</p>";

const meta: Meta = {
    title: "Navigation/ChatMessage",
    render: (args) => h("lily-chat-message", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Message from Alex, 10:00"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
