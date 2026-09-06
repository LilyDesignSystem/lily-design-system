import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./submit-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Forms/SubmitInput",
    render: (args) => h("lily-submit-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "value": "Submit",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
