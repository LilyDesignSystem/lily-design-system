import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./flair.js";
import { h } from "../stories/render.js";

const SLOT = "New";

const meta: Meta = {
    title: "Content/Flair",
    render: (args) => h("lily-flair", args as Record<string, string | boolean>, SLOT),
    args: {},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Meaningful: Story = {
    args: {
        "label": "Role: Moderator",
    },
};
