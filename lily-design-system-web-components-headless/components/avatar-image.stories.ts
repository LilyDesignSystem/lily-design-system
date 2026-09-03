import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./avatar-image.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Media and data/AvatarImage",
    render: (args) => h("lily-avatar-image", args as Record<string, string | boolean>, SLOT),
    args: {
        "src": "https://placehold.co/64",
        "alt": "Ada Lovelace"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
