import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./measurement-instance-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Content/MeasurementInstanceView",
    render: (args) => h("lily-measurement-instance-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "value": "72 kg",
        "label": "Patient weight",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
