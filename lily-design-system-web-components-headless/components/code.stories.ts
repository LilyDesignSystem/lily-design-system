import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./code.js";
import { h } from "../stories/render.js";

const SLOT = "const answer = 42;";

const meta: Meta = {
    title: "Content/Code",
    render: (args) => h("lily-code", args as Record<string, string | boolean>, SLOT),
    args: {},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
