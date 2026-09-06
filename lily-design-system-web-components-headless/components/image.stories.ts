import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./image.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Media and data/Image",
    render: (args) => h("lily-image", args as Record<string, string | boolean>, SLOT),
    args: {
        "src": "https://placehold.co/400x250",
        "alt": "A sunset over the ocean",
        "caption": "Photo by Jane Doe"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
