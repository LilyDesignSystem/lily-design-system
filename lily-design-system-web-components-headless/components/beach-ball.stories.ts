import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./beach-ball.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Content/BeachBall",
    render: (args) => h("lily-beach-ball", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Loading results",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
