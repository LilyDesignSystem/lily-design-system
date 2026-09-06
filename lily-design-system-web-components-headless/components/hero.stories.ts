import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./hero.js";
import { h } from "../stories/render.js";

const SLOT = "<h1>Welcome to Lily</h1><p>A headless, accessible design system.</p>";

const meta: Meta = {
    title: "Navigation/Hero",
    render: (args) => h("lily-hero", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Welcome"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
