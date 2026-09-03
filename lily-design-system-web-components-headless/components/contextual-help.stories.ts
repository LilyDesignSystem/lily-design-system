import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./contextual-help.js";
import { h } from "../stories/render.js";

const SLOT = "This field controls the account's display name.";

const meta: Meta = {
    title: "Overlays/ContextualHelp",
    render: (args) => h("lily-contextual-help", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "What is this?"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
