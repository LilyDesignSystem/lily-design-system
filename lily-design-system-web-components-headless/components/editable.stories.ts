import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./editable.js";
import { h } from "../stories/render.js";

const meta: Meta = {
    title: "Content/Editable",
    render: (args) => h("lily-editable", args as Record<string, string | boolean>),
    args: {
        "label": "Name",
        "value": "Ada Lovelace",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Editing: Story = {
    args: {
        "label": "Name",
        "value": "Ada Lovelace",
        "editing": true,
    },
};
