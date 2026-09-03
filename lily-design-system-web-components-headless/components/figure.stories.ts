import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./figure.js";
import { h } from "../stories/render.js";

const SLOT = "<svg width=\"100\" height=\"40\" role=\"presentation\" aria-hidden=\"true\"><rect width=\"100\" height=\"40\" fill=\"currentColor\"/></svg>";

const meta: Meta = {
    title: "Media and data/Figure",
    render: (args) => h("lily-figure", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Sales chart"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
