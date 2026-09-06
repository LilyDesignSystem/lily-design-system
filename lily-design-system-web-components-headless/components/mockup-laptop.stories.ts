import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./mockup-laptop.js";
import { h } from "../stories/render.js";

const SLOT = "<p>Dashboard preview</p>";

const meta: Meta = {
    title: "Content/MockupLaptop",
    render: (args) => h("lily-mockup-laptop", args as Record<string, string | boolean>, SLOT),
    args: {
        label: "Preview of the dashboard",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
