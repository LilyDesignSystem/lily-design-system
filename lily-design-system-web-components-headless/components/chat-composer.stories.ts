import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./chat-composer.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Media and data/ChatComposer",
    render: (args) => h("lily-chat-composer", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Message",
        "send-label": "Send",
        "stop-label": "Stop"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
