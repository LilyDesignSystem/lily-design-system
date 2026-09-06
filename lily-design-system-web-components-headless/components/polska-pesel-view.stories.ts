import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./polska-pesel-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/PolskaPeselView",
    render: (args) => h("lily-polska-pesel-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "PESEL",
        "value": "44051401359"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
