import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./picture.js";
import { h } from "../stories/render.js";

const SLOT =
    '<source srcset="wide.webp" media="(min-width: 800px)" type="image/webp"><img src="small.jpg" alt="A lily in bloom" width="320" height="200">';

const meta: Meta = {
    title: "Media and data/Picture",
    render: (args) => h("lily-picture", args as Record<string, string | boolean>, SLOT),
    args: {},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
