import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./mockup-browser.js";
import { h } from "../stories/render.js";

const SLOT = "<p>Preview of the homepage</p>";

const meta: Meta = {
    title: "Content/MockupBrowser",
    render: (args) => h("lily-mockup-browser", args as Record<string, string | boolean>, SLOT),
    args: {
        label: "Preview of the homepage",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
