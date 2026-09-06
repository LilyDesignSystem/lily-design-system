import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./tab-panel.js";
import { h } from "../stories/render.js";

const SLOT = "Details content for the selected tab.";

const meta: Meta = {
    title: "Overlays/TabPanel",
    render: (args) => h("lily-tab-panel", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Details",
        "selected": true
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
