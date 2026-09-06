import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./statistic.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Content/Statistic",
    render: (args) => h("lily-statistic", args as Record<string, string | boolean>, SLOT),
    args: {
        "title": "Revenue",
        "value": "2,400",
        "prefix": "$",
        "suffix": "K",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
