import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./kbd.js";
import { h } from "../stories/render.js";

const SLOT = "Ctrl";

const meta: Meta = {
    title: "Content/Kbd",
    render: (args) => h("lily-kbd", args as Record<string, string | boolean>, SLOT),
    args: {},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
