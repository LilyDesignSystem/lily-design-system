import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./measurement-system-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Content/MeasurementSystemView",
    render: (args) => h("lily-measurement-system-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "value": "SI",
        "label": "International System of Units",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
