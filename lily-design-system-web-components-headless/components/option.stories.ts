import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./option.js";
import { h } from "../stories/render.js";

const SLOT = "Ada Lovelace";

const meta: Meta = {
    title: "Forms/Option",
    render: (args) => h("lily-option", args as Record<string, string | boolean>, SLOT),
    args: {
        "value": "ada"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
