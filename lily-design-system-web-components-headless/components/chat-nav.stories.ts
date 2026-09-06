import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./chat-nav.js";
import { h } from "../stories/render.js";

const SLOT = "<ol><li>Alex — Hey, are we still on for today?</li></ol>";

const meta: Meta = {
    title: "Navigation/ChatNav",
    render: (args) => h("lily-chat-nav", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Chat conversations"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
