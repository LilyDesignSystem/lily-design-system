import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./horizontal-scroller.js";
import { h } from "../stories/render.js";

const SLOT =
    '<img src="https://placehold.co/200x150" alt="Photo 1" /><img src="https://placehold.co/200x150" alt="Photo 2" /><img src="https://placehold.co/200x150" alt="Photo 3" />';

const meta: Meta = {
    title: "Content/HorizontalScroller",
    render: (args) => h("lily-horizontal-scroller", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Photo gallery",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
