import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./section-link.js";
import { h } from "../stories/render.js";

const SLOT = "Section 1";

const meta: Meta = {
    title: "Links/SectionLink",
    render: (args) => h("lily-section-link", args as Record<string, string | boolean>, SLOT),
    args: {
        "href": "/section-1"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
