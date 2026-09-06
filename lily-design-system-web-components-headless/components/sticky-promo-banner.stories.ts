import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./sticky-promo-banner.js";
import { h } from "../stories/render.js";

const SLOT = "Save 20% this week only.";

const meta: Meta = {
    title: "Overlays/StickyPromoBanner",
    render: (args) => h("lily-sticky-promo-banner", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Promotion",
        "position": "bottom",
        "dismissible": true,
        "dismiss-label": "Dismiss promotion"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
