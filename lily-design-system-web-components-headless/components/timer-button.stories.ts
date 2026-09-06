import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./timer-button.js";
import { h } from "../stories/render.js";

const SLOT = "Continue";

const meta: Meta = {
    title: "Buttons and links/TimerButton",
    render: (args) => h("lily-timer-button", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Continue",
        "duration": "10"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
