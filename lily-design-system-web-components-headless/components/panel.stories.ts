import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./panel.js";
import { h } from "../stories/render.js";

const SLOT = "<p>Adjust your preferences below.</p>";

const meta: Meta = {
    title: "Content/Panel",
    render: (args) => h("lily-panel", args as Record<string, string | boolean>, SLOT),
    args: {
        label: "Settings",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
