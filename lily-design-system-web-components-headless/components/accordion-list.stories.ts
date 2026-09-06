import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./accordion-list.js";

import { h } from "../stories/render.js";

const SLOT = "<details><summary>What is this?</summary><p>A design system.</p></details><details><summary>Is it free?</summary><p>Yes.</p></details>";

const meta: Meta = {
    title: "Lists/AccordionList",
    render: (args) => h("lily-accordion-list", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Questions",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
