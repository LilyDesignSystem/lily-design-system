import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./avatar-text.js";
import { h } from "../stories/render.js";

const SLOT = "JD";

const meta: Meta = {
    title: "Content/AvatarText",
    render: (args) => h("lily-avatar-text", args as Record<string, string | boolean>, SLOT),
    args: {},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
