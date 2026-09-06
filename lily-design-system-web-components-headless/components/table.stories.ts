import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./table.js";
import { h } from "../stories/render.js";

const SLOT =
    '<thead><tr><th scope="col">Name</th><th scope="col">Email</th></tr></thead>' +
    '<tbody><tr><td>Alice</td><td>alice@example.com</td></tr></tbody>';

const meta: Meta = {
    title: "Tables/Table",
    render: (args) => h("lily-table", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "User accounts"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
