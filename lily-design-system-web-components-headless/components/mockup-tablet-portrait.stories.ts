import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./mockup-tablet-portrait.js";
import { h } from "../stories/render.js";

const SLOT = "<p>Article preview</p>";

const meta: Meta = {
    title: "Content/MockupTabletPortrait",
    render: (args) => h("lily-mockup-tablet-portrait", args as Record<string, string | boolean>, SLOT),
    args: {
        label: "Preview of the article",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
