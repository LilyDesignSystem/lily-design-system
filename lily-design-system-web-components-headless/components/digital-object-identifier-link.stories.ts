import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./digital-object-identifier-link.js";
import { h } from "../stories/render.js";

const SLOT = "Read the paper";

const meta: Meta = {
    title: "Links/DigitalObjectIdentifierLink",
    render: (args) => h("lily-digital-object-identifier-link", args as Record<string, string | boolean>, SLOT),
    args: {
        "doi": "10.1000/xyz123"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
