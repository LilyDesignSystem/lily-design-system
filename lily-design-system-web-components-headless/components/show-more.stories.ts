import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./show-more.js";
import { h } from "../stories/render.js";

const SLOT = '<p>Long content that a consumer clamps with CSS.</p>';

const meta: Meta = {
    title: "Content/ShowMore",
    render: (args) => h("lily-show-more", args as Record<string, string | boolean>, SLOT),
    args: { "more-label": "Show more", "less-label": "Show less" },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
