import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./convert-from-value-div.js";
import { h } from "../stories/render.js";

const SLOT = "100 US dollars";

const meta: Meta = {
    title: "Forms/ConvertFromValueDiv",
    render: (args) => h("lily-convert-from-value-div", args as Record<string, string | boolean>, SLOT),
    args: {},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
