import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./skeleton.js";
import { h } from "../stories/render.js";

const SLOT = '<div class="skeleton-line"></div><div class="skeleton-line"></div>';

const meta: Meta = {
    title: "Content/Skeleton",
    render: (args) => h("lily-skeleton", args as Record<string, string | boolean>, SLOT),
    args: {},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
