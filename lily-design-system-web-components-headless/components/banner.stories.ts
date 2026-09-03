import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./banner.js";
import { h } from "../stories/render.js";

const SLOT = "A new version is available.";

const meta: Meta = {
    title: "Content/Banner",
    render: (args) => h("lily-banner", args as Record<string, string | boolean>, SLOT),
    args: {
        "dismissible": true,
        "close-label": "Dismiss"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
