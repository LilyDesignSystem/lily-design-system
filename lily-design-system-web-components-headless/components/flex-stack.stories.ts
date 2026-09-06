import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./flex-stack.js";
import { h } from "../stories/render.js";

const SLOT = "<span>One</span><span>Two</span><span>Three</span>";

const meta: Meta = {
    title: "Content/FlexStack",
    render: (args) => h("lily-flex-stack", args as Record<string, string | boolean>, SLOT),
    args: {
        "direction": "row",
        "gap": "1rem",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
