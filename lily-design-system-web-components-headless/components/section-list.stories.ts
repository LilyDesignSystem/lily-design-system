import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./section-list.js";

import { h } from "../stories/render.js";

const SLOT = '<li><a href="/intro">Introduction</a></li><li><a href="/usage">Usage</a></li>';

const meta: Meta = {
    title: "Lists/SectionList",
    render: (args) => h("lily-section-list", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Chapters",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
