import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./mockup-tablet-landscape.js";
import { h } from "../stories/render.js";

const SLOT = "<p>Article preview</p>";

const meta: Meta = {
    title: "Content/MockupTabletLandscape",
    render: (args) => h("lily-mockup-tablet-landscape", args as Record<string, string | boolean>, SLOT),
    args: {
        label: "Preview of the article",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
