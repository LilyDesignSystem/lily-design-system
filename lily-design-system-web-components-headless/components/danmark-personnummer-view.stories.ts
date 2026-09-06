import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./danmark-personnummer-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/DanmarkPersonnummerView",
    render: (args) => h("lily-danmark-personnummer-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Personnummer",
        "value": "0101851234"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
