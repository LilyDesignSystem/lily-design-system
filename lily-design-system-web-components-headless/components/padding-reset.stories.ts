import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./padding-reset.js";
import { h } from "../stories/render.js";

const SLOT = "<figure>Full-bleed chart content</figure>";

const meta: Meta = {
    title: "Content/PaddingReset",
    render: (args) => h("lily-padding-reset", args as Record<string, string | boolean>, SLOT),
    args: {},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
