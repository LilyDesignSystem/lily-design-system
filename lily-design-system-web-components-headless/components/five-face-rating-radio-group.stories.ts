import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./five-face-rating-radio-group.js";
import { h } from "../stories/render.js";

const SLOT =
    '<label><input type="radio" name="delivery" value="email"> Email</label><label><input type="radio" name="delivery" value="post"> Post</label>';

const meta: Meta = {
    title: "Forms/FiveFaceRatingRadioGroup",
    render: (args) =>
        h("lily-five-face-rating-radio-group", args as Record<string, string | boolean>, SLOT),
    args: {
        label: "Delivery method",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
