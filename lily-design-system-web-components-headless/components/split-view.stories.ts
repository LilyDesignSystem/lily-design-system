import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./split-view.js";
import { h } from "../stories/render.js";

const SLOT = '<div slot="primary">File browser</div><div slot="secondary">Editor</div>';

const meta: Meta = {
    title: "Navigation/SplitView",
    render: (args) => h("lily-split-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Files and editor",
        "orientation": "horizontal",
        "split-percent": "30"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
