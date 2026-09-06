import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./product-card.js";
import { h } from "../stories/render.js";

const SLOT = "<p>A delightful widget for all occasions.</p><button>Add to cart</button>";

const meta: Meta = {
    title: "Navigation/ProductCard",
    render: (args) => h("lily-product-card", args as Record<string, string | boolean>, SLOT),
    args: {
        "name": "Wonder Widget",
        "price": "$19.99",
        "image-url": "https://placehold.co/200x200",
        "image-alt": "A photo of the Wonder Widget"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
