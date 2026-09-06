import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./data-table.js";
import { h } from "../stories/render.js";

const SLOT =
    '<thead><tr><th scope="col">Month</th><th scope="col">Revenue</th></tr></thead>' +
    "<tbody><tr><td>January</td><td>$10,000</td></tr></tbody>";

const meta: Meta = {
    title: "Tables/DataTable",
    render: (args) => h("lily-data-table", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Sales data",
        "caption": "Quarterly sales"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
