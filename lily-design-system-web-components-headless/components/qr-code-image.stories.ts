import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./qr-code-image.js";
import { h } from "../stories/render.js";

const SLOT = '<svg viewBox="0 0 29 29" aria-hidden="true"><rect width="29" height="29" fill="currentColor"></rect></svg>';

const meta: Meta = {
    title: "Content/QrCodeImage",
    render: (args) => h("lily-qr-code-image", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Scan to visit example.com"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
