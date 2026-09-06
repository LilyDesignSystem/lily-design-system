import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./description-list.js";

import { h } from "../stories/render.js";

const SLOT = "<dt>Name</dt><dd>Widget</dd><dt>Quantity</dt><dd>3</dd>";

const meta: Meta = {
    title: "Lists/DescriptionList",
    render: (args) => h("lily-description-list", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Order details",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
