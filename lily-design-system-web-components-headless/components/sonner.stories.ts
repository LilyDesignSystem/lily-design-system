import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./sonner.js";
import { h } from "../stories/render.js";

const SLOT = '<div role="status">File saved successfully.</div>';

const meta: Meta = {
    title: "Content/Sonner",
    render: (args) => h("lily-sonner", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Notifications"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
