import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./input-group.js";
import { h } from "../stories/render.js";

const SLOT = "<span slot=\"prefix\">$</span><input type=\"number\"><span slot=\"suffix\">USD</span>";

const meta: Meta = {
    title: "Forms/InputGroup",
    render: (args) => h("lily-input-group", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Amount"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
