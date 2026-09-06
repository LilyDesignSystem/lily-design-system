import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./pin-input-div.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Content/PinInputDiv",
    render: (args) => h("lily-pin-input-div", args as Record<string, string | boolean>, SLOT),
    args: {
        label: "Enter PIN",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const SixDigitCode: Story = {
    args: { label: "Verification code", length: "6" },
};
