import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./eesti-isikukood-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/EestiIsikukoodView",
    render: (args) => h("lily-eesti-isikukood-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Isikukood",
        "value": "38001085718"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
