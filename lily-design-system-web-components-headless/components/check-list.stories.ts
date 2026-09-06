import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./check-list.js";

import { h } from "../stories/render.js";

const SLOT = "<li>Create account</li><li>Set up profile</li><li>Invite team members</li>";

const meta: Meta = {
    title: "Lists/CheckList",
    render: (args) => h("lily-check-list", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Onboarding tasks",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
