import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./organization.js";
import { h } from "../stories/render.js";

const SLOT = "<h2>Acme Corporation</h2><p>A global widget manufacturer.</p>";

const meta: Meta = {
    title: "Navigation/Organization",
    render: (args) => h("lily-organization", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Acme Corporation"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
