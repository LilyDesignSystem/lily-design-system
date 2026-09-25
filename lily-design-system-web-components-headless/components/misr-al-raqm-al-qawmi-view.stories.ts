import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./misr-al-raqm-al-qawmi-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/MisrAlRaqmAlQawmiView",
    render: (args) => h("lily-misr-al-raqm-al-qawmi-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "الرقم القومي (National Number)",
        "value": "29001011234567"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
