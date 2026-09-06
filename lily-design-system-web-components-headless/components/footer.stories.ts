import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./footer.js";
import { h } from "../stories/render.js";

const SLOT = "<p>&copy; 2026 Lily Design System</p>";

const meta: Meta = {
    title: "Navigation/Footer",
    render: (args) => h("lily-footer", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Site footer"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
