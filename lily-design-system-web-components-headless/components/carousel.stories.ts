import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./carousel.js";
import { h } from "../stories/render.js";

const SLOT = "<div>Slide 1 of 3</div>";

const meta: Meta = {
    title: "Content/Carousel",
    render: (args) => h("lily-carousel", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Featured products",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
