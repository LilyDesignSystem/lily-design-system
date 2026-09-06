import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./hrvatska-osobni-identifikacijski-broj-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/HrvatskaOsobniIdentifikacijskiBrojView",
    render: (args) => h("lily-hrvatska-osobni-identifikacijski-broj-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Osobni identifikacijski broj (OIB)",
        "value": "94577403194"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
