import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./go-to-previous-section.js";
import { h } from "../stories/render.js";

const meta: Meta = {
    title: "Links/GoToPreviousSection",
    render: (args) => h("lily-go-to-previous-section", args as Record<string, string | boolean>),
    args: {
        "href": "#section-1",
        "label": "Previous: Overview"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
