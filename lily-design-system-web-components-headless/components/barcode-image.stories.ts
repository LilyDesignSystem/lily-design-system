import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./barcode-image.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Media and data/BarcodeImage",
    render: (args) => h("lily-barcode-image", args as Record<string, string | boolean>, SLOT),
    args: {
        "src": "https://placehold.co/200x60",
        "alt": "Order number 12345"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
