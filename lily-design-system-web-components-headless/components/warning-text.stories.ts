import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./warning-text.js";
import { h } from "../stories/render.js";

const SLOT =
    '<span slot="icon">!</span><span class="visually-hidden">Warning</span> You can be fined up to £5,000 if you do not register.';

const meta: Meta = {
    title: "Content/WarningText",
    render: (args) => h("lily-warning-text", args as Record<string, string | boolean>, SLOT),
    args: {},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
