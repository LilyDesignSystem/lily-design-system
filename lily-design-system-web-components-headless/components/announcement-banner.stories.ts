import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./announcement-banner.js";
import { h } from "../stories/render.js";

const SLOT = "A new feature has launched. <a href=\"#\">Learn more</a>.";

const meta: Meta = {
    title: "Overlays/AnnouncementBanner",
    render: (args) => h("lily-announcement-banner", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Site announcement",
        "dismissible": true,
        "dismiss-label": "Dismiss announcement"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
