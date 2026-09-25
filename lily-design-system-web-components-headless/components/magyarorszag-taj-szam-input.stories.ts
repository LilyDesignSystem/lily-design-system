import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./magyarorszag-taj-szam-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/MagyarorszagTajSzamInput",
    render: (args) => h("lily-magyarorszag-taj-szam-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Társadalombiztosítási Azonosító Jel (TAJ)"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
