import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./convert-div.js";
import { h } from "../stories/render.js";

const SLOT = "100 US dollars";

const meta: Meta = {
    title: "Forms/ConvertDiv",
    render: (args) => h("lily-convert-div", args as Record<string, string | boolean>, SLOT),
    args: {"label": "Currency converter"},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
