import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./inset-text.js";
import { h } from "../stories/render.js";

const SLOT = "<p>It can take up to 8 weeks to process your application.</p>";

const meta: Meta = {
    title: "Content/InsetText",
    render: (args) => h("lily-inset-text", args as Record<string, string | boolean>, SLOT),
    args: {},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
