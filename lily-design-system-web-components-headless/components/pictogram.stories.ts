import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./pictogram.js";
import { h } from "../stories/render.js";

const SLOT = '<span slot="icon" style="font-size: 2rem;">&#128274;</span>';

const meta: Meta = {
    title: "Media and data/Pictogram",
    render: (args) => h("lily-pictogram", args as Record<string, string | boolean>, SLOT),
    args: {
        "layout": "centered",
        "heading": "Privacy",
        "description": "Your data stays on your device."
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
