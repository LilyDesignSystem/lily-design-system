import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./addressograph-box.js";
import { h } from "../stories/render.js";

const SLOT = "Jane Doe · NHS 123 456 7890 · Ward 4B";

const meta: Meta = {
    title: "Content/AddressographBox",
    render: (args) => h("lily-addressograph-box", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Patient identification",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
