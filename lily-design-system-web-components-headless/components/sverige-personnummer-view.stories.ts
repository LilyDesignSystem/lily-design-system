import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./sverige-personnummer-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/SverigePersonnummerView",
    render: (args) => h("lily-sverige-personnummer-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Personnummer",
        "value": "198507099805"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
