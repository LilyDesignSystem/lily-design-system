import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./url-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Forms/UrlInput",
    render: (args) => h("lily-url-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Website",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
