import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./step-list-item.js";
import { h } from "../stories/render.js";

const SLOT = "Shipping";

const meta: Meta = {
    title: "Lists/StepListItem",
    render: (args) => {
        const ol = document.createElement("ol");
        ol.className = "step-list";
        ol.appendChild(h("lily-step-list-item", args as Record<string, string | boolean>, SLOT));
        return ol;
    },
    args: {
        "status": "in-progress",
        "current": true,
        "label": "Step 2: Shipping",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
