import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./accordion-link.js";
import { h } from "../stories/render.js";

const SLOT = "Section 1";

const meta: Meta = {
    title: "Links/AccordionLink",
    render: (args) => h("lily-accordion-link", args as Record<string, string | boolean>, SLOT),
    args: {
        "href": "#section-1"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
