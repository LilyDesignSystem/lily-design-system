import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./button-group.js";
import { h } from "../stories/render.js";

const SLOT = '<button type="button">Save</button><button type="button">Cancel</button>';

const meta: Meta = {
    title: "Forms/ButtonGroup",
    render: (args) => h("lily-button-group", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Form actions"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
