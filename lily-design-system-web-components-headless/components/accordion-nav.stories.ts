import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./accordion-nav.js";
import { h } from "../stories/render.js";

const SLOT = "<div role=\"group\"><details><summary>What is this?</summary><p>A design system.</p></details></div>";

const meta: Meta = {
    title: "Navigation/AccordionNav",
    render: (args) => h("lily-accordion-nav", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Frequently Asked Questions"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
