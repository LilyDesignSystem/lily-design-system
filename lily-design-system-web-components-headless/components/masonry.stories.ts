import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./masonry.js";
import { h } from "../stories/render.js";

const SLOT = "<div>One</div><div>Two</div><div>Three</div><div>Four</div><div>Five</div>";

const meta: Meta = {
    title: "Content/Masonry",
    render: (args) => h("lily-masonry", args as Record<string, string | boolean>, SLOT),
    args: {
        "columns": "3",
        "gap": "1rem",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
