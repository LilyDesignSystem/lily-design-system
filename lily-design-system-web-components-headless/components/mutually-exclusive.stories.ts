import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./mutually-exclusive.js";
import { h } from "../stories/render.js";

const SLOT = '<label><input type="checkbox" value="a" /> Option A</label><label><input type="checkbox" value="b" /> Option B</label>';

const meta: Meta = {
    title: "Content/MutuallyExclusive",
    render: (args) => h("lily-mutually-exclusive", args as Record<string, string | boolean>, SLOT),
    args: {
        label: "Choose one",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
