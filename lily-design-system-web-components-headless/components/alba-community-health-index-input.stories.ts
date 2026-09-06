import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./alba-community-health-index-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/AlbaCommunityHealthIndexInput",
    render: (args) => h("lily-alba-community-health-index-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Community Health Index"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
