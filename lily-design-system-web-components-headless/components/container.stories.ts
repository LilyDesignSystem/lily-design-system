import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./container.js";
import { h } from "../stories/render.js";

const SLOT = "<p>Generic block-level content.</p>";

const meta: Meta = {
    title: "Content/Container",
    render: (args) => h("lily-container", args as Record<string, string | boolean>, SLOT),
    args: {},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
