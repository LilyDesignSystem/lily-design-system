import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./info-state.js";
import { h } from "../stories/render.js";

const SLOT = "<button>Reset filters</button>";

const meta: Meta = {
    title: "Navigation/InfoState",
    render: (args) => h("lily-info-state", args as Record<string, string | boolean>, SLOT),
    args: {
        "title": "No results",
        "description": "Try adjusting your filters.",
        "level": "empty"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
