import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./alba-community-health-index-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/AlbaCommunityHealthIndexView",
    render: (args) => h("lily-alba-community-health-index-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Community Health Index",
        "value": "1505850123"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
