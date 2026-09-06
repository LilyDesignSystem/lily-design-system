import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./avatar-group.js";
import { h } from "../stories/render.js";

const SLOT = '<span>AB</span><span>CD</span><span>EF</span>';

const meta: Meta = {
    title: "Forms/AvatarGroup",
    render: (args) => h("lily-avatar-group", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Team members"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
