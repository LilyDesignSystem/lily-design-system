import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./super-banner.js";
import { h } from "../stories/render.js";

const SLOT = "System maintenance is in progress. Some features may be unavailable.";

const meta: Meta = {
    title: "Overlays/SuperBanner",
    render: (args) => h("lily-super-banner", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "System status",
        "dismissable": true
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
