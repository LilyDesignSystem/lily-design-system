import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./convert-into-value-div.js";
import { h } from "../stories/render.js";

const SLOT = "100 US dollars";

const meta: Meta = {
    title: "Forms/ConvertIntoValueDiv",
    render: (args) => h("lily-convert-into-value-div", args as Record<string, string | boolean>, SLOT),
    args: {},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
