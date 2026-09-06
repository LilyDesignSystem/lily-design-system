import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./popup.js";
import { h } from "../stories/render.js";

const SLOT = "<p>Are you sure you want to proceed?</p>";

const meta: Meta = {
    title: "Content/Popup",
    render: (args) => h("lily-popup", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Confirmation",
        "open": true
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
