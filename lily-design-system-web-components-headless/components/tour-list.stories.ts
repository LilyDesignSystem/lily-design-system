import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./tour-list.js";

import { h } from "../stories/render.js";

const SLOT = "<li>Welcome to the app!</li><li>Here are the features.</li>";

const meta: Meta = {
    title: "Lists/TourList",
    render: (args) => h("lily-tour-list", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Getting started",
        "active": true,
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
