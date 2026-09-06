import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./avatar.js";
import { h } from "../stories/render.js";

const SLOT = "JD";

const meta: Meta = {
    title: "Content/Avatar",
    render: (args) => h("lily-avatar", args as Record<string, string | boolean>, SLOT),
    args: {
        "alt": "Jane Doe",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
