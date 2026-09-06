import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./phase-banner.js";
import { h } from "../stories/render.js";

const SLOT = 'This is a new service. <a href="#">Give feedback</a>.';

const meta: Meta = {
    title: "Overlays/PhaseBanner",
    render: (args) => h("lily-phase-banner", args as Record<string, string | boolean>, SLOT),
    args: {
        "phase": "Beta"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
