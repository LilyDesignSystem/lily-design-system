import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./button.js";
import { h } from "../stories/render.js";

const SLOT = "Save";

const meta: Meta = {
    title: "Buttons and links/Button",
    render: (args) => h("lily-button", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Save"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
