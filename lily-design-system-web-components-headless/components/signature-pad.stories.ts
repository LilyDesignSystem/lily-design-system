import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./signature-pad.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Media and data/SignaturePad",
    render: (args) => h("lily-signature-pad", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Sign to accept the terms",
        "width": "400",
        "height": "150"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
