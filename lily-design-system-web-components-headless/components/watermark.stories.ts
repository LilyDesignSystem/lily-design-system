import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./watermark.js";
import { h } from "../stories/render.js";

const SLOT = "<article>Document body content goes here.</article>";

const meta: Meta = {
    title: "Content/Watermark",
    render: (args) => h("lily-watermark", args as Record<string, string | boolean>, SLOT),
    args: {
        "text": "DRAFT",
        "rotate": "-22",
        "gap": "120px",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
