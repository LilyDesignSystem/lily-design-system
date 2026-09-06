import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./citation.js";
import { h } from "../stories/render.js";

const SLOT = "The Origin of Species";

const meta: Meta = {
    title: "Content/Citation",
    render: (args) => h("lily-citation", args as Record<string, string | boolean>, SLOT),
    args: {},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
