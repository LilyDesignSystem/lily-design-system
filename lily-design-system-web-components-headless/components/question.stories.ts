import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./question.js";
import { h } from "../stories/render.js";

const SLOT = "What is your favourite colour?";

const meta: Meta = {
    title: "Content/Question",
    render: (args) => h("lily-question", args as Record<string, string | boolean>, SLOT),
    args: {},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
