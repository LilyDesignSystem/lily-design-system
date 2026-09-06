import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./validation-list.js";

import { h } from "../stories/render.js";

const SLOT = '<li data-status="pending">At least 8 characters</li><li data-status="passed">Contains a number</li><li data-status="failed">Contains a symbol</li>';

const meta: Meta = {
    title: "Lists/ValidationList",
    render: (args) => h("lily-validation-list", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Password requirements",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
