import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./framer.js";
import { h } from "../stories/render.js";

const SLOT = '<img src="https://placehold.co/300x200" alt="Dashboard showing metrics" />';

const meta: Meta = {
    title: "Content/Framer",
    render: (args) => h("lily-framer", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Screenshot of the application dashboard",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
