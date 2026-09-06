import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./caption.js";
import { h } from "../stories/render.js";

const SLOT = "Table 1: Quarterly sales by region";

const meta: Meta = {
    title: "Tables/Caption",
    render: (args) => h("lily-caption", args as Record<string, string | boolean>, SLOT),
    args: {},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
