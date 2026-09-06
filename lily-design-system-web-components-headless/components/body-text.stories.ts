import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./body-text.js";
import { h } from "../stories/render.js";

const SLOT = "<p>The quick brown fox jumps over the lazy dog.</p>";

const meta: Meta = {
    title: "Content/BodyText",
    render: (args) => h("lily-body-text", args as Record<string, string | boolean>, SLOT),
    args: {},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
