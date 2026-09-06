import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./sverige-personnummer-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/SverigePersonnummerInput",
    render: (args) => h("lily-sverige-personnummer-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Personnummer"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
