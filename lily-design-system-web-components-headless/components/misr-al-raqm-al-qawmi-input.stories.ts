import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./misr-al-raqm-al-qawmi-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/MisrAlRaqmAlQawmiInput",
    render: (args) => h("lily-misr-al-raqm-al-qawmi-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "الرقم القومي (National Number)"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
