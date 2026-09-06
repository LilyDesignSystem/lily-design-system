import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./hrvatska-osobni-identifikacijski-broj-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/HrvatskaOsobniIdentifikacijskiBrojInput",
    render: (args) => h("lily-hrvatska-osobni-identifikacijski-broj-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Osobni identifikacijski broj (OIB)"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
