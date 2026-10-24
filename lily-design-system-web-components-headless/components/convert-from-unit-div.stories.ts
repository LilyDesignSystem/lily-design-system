import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./convert-from-unit-div.js";
import { h } from "../stories/render.js";

const SLOT = "100 US dollars";

const meta: Meta = {
    title: "Forms/ConvertFromUnitDiv",
    render: (args) => h("lily-convert-from-unit-div", args as Record<string, string | boolean>, SLOT),
    args: {},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
