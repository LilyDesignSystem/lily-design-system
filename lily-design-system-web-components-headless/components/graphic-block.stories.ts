import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./graphic-block.js";
import { h } from "../stories/render.js";

const SLOT = '<svg viewBox="0 0 100 40" aria-hidden="true"><rect width="100" height="40" /></svg>';

const meta: Meta = {
    title: "Media and data/GraphicBlock",
    render: (args) => h("lily-graphic-block", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Quarterly revenue chart",
        "title": "Revenue",
        "description": "By quarter, in thousands of dollars",
        "notes": "Source: internal reporting"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
