import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./error-message.js";
import { h } from "../stories/render.js";

const SLOT = "Password is required.";

const meta: Meta = {
    title: "Content/ErrorMessage",
    render: (args) => h("lily-error-message", args as Record<string, string | boolean>, SLOT),
    args: {},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
