import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./magyarorszag-taj-szam-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/MagyarorszagTajSzamView",
    render: (args) => h("lily-magyarorszag-taj-szam-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Társadalombiztosítási Azonosító Jel (TAJ)",
        "value": "123 456 789"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
