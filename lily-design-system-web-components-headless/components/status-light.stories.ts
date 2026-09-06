import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./status-light.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Content/StatusLight",
    render: (args) => h("lily-status-light", args as Record<string, string | boolean>, SLOT),
    args: {
        "variant": "positive",
        "label": "Active",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
