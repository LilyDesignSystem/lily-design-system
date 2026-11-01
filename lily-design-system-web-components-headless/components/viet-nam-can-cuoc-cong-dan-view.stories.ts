import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./viet-nam-can-cuoc-cong-dan-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/VietNamCanCuocCongDanView",
    render: (args) =>
        h("lily-viet-nam-can-cuoc-cong-dan-view", args as Record<string, string | boolean>, SLOT),
    args: {
        label: "Citizen Identification Number (CCCD)",
        value: "079205012345",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
