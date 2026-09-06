import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./tab-bar.js";
import "./tab-bar-button.js";
import { h } from "../stories/render.js";

const SLOT = '<lily-tab-bar-button selected controls="panel-about">About this medicine</lily-tab-bar-button><lily-tab-bar-button controls="panel-dosage">Dosage</lily-tab-bar-button><lily-tab-bar-button controls="panel-side-effects">Side effects</lily-tab-bar-button>';

const meta: Meta = {
    title: "Navigation/TabBar",
    render: (args) => h("lily-tab-bar", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Medication information"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
