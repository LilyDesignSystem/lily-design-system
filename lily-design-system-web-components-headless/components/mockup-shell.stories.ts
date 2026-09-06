import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./mockup-shell.js";
import { h } from "../stories/render.js";

const SLOT = "<p>$ npm install</p>";

const meta: Meta = {
    title: "Content/MockupShell",
    render: (args) => h("lily-mockup-shell", args as Record<string, string | boolean>, SLOT),
    args: {
        label: "Preview of the terminal session",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
