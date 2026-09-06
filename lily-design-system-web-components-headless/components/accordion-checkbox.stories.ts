import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./accordion-checkbox.js";
import { h } from "../stories/render.js";

const SLOT = "Tell us more in the text area below.";

const meta: Meta = {
    title: "Content/AccordionCheckbox",
    render: (args) => h("lily-accordion-checkbox", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "I have additional comments",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
