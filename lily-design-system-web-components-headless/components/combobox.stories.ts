import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./combobox.js";
import { h } from "../stories/render.js";

const SLOT =
    '<div role="option">Apple</div><div role="option">Apricot</div><div role="option">Banana</div>';

const meta: Meta = {
    title: "Content/Combobox",
    render: (args) => h("lily-combobox", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Choose a fruit",
        "open": true,
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
