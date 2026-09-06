import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./input-with-mask.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Content/InputWithMask",
    render: (args) => h("lily-input-with-mask", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Phone number",
        "mask": "(___) ___-____",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
