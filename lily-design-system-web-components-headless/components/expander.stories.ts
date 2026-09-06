import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./expander.js";
import { h } from "../stories/render.js";

const SLOT = "<p>Here are the advanced settings that most people can leave alone.</p>";

const meta: Meta = {
    title: "Content/Expander",
    render: (args) => h("lily-expander", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Show advanced settings",
        "expanded": true,
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
