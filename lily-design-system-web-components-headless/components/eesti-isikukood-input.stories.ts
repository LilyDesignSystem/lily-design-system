import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./eesti-isikukood-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/EestiIsikukoodInput",
    render: (args) => h("lily-eesti-isikukood-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Isikukood"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
