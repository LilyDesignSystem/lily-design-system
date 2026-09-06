import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./form.js";
import { h } from "../stories/render.js";

const SLOT = '<input name="email" placeholder="you@example.com"><button type="submit">Submit</button>';

const meta: Meta = {
    title: "Forms/Form",
    render: (args) => h("lily-form", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Contact"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
