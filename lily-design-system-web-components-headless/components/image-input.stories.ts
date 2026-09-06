import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./image-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Forms/ImageInput",
    render: (args) => h("lily-image-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "src": "https://example.com/submit.png",
        "alt": "Submit"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
