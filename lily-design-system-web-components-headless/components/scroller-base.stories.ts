import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./scroller-base.js";
import { h } from "../stories/render.js";

const SLOT = "<div>Step 1</div><div>Step 2</div><div>Step 3</div>";

const meta: Meta = {
    title: "Content/ScrollerBase",
    render: (args) => h("lily-scroller-base", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Story steps",
        "offset": "0.5"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
