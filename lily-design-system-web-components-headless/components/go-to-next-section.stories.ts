import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./go-to-next-section.js";
import { h } from "../stories/render.js";

const meta: Meta = {
    title: "Links/GoToNextSection",
    render: (args) => h("lily-go-to-next-section", args as Record<string, string | boolean>),
    args: {
        "href": "#section-3",
        "label": "Next: Pricing"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
