import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./coachmark.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Overlays/Coachmark",
    render: (args) => h("lily-coachmark", args as Record<string, string | boolean>, SLOT),
    args: {
        "title": "New feature",
        "description": "Try it out.",
        "dismiss-label": "Dismiss",
        "open": true
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
