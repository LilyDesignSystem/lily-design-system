import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./mockup-watch.js";
import { h } from "../stories/render.js";

const SLOT = "<p>12:45</p>";

const meta: Meta = {
    title: "Content/MockupWatch",
    render: (args) => h("lily-mockup-watch", args as Record<string, string | boolean>, SLOT),
    args: {
        label: "Preview of the watch face",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
