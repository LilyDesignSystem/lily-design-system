import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./fieldset.js";
import { h } from "../stories/render.js";

const SLOT = "<label>Name <input type=\"text\"></label>";

const meta: Meta = {
    title: "Forms/Fieldset",
    render: (args) => h("lily-fieldset", args as Record<string, string | boolean>, SLOT),
    args: {
        "legend": "Contact details"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
