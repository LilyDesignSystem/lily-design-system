import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./tel-link.js";
import { h } from "../stories/render.js";

const meta: Meta = {
    title: "Links/TelLink",
    render: (args) => h("lily-tel-link", args as Record<string, string | boolean>),
    args: {
        "phone": "+1-555-0100"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
