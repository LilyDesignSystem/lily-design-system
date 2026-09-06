import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./date-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Forms/DateInput",
    render: (args) => h("lily-date-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Date of birth"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
