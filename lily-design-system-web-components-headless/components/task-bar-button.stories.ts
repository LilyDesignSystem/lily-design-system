import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./task-bar-button.js";
import { h } from "../stories/render.js";

const SLOT = "New Referral";

const meta: Meta = {
    title: "Navigation/TaskBarButton",
    render: (args) => h("lily-task-bar-button", args as Record<string, string | boolean>, SLOT),
    args: {},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
