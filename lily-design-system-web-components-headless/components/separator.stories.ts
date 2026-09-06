import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./separator.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Navigation/Separator",
    render: (args) => h("lily-separator", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "End of introduction"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
