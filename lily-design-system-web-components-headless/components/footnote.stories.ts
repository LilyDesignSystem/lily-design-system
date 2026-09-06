import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./footnote.js";
import { h } from "../stories/render.js";

const SLOT = "Source: Example et al., 2024";

const meta: Meta = {
    title: "Content/Footnote",
    render: (args) => h("lily-footnote", args as Record<string, string | boolean>, SLOT),
    args: {
        "id": "fn1",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
