import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./grid.js";
import { h } from "../stories/render.js";

const SLOT = "<div>One</div><div>Two</div><div>Three</div>";

const meta: Meta = {
    title: "Content/Grid",
    render: (args) => h("lily-grid", args as Record<string, string | boolean>, SLOT),
    args: {
        "columns": "3",
        "gap": "1.5rem",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
