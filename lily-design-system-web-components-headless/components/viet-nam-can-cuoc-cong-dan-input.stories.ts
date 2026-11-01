import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./viet-nam-can-cuoc-cong-dan-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/VietNamCanCuocCongDanInput",
    render: (args) =>
        h("lily-viet-nam-can-cuoc-cong-dan-input", args as Record<string, string | boolean>, SLOT),
    args: {
        label: "Citizen Identification Number (CCCD)",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
