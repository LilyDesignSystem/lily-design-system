import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./container-with-fluid-width.js";
import { h } from "../stories/render.js";

const SLOT = "<section>Full-width content with horizontal padding.</section>";

const meta: Meta = {
    title: "Content/ContainerWithFluidWidth",
    render: (args) => h("lily-container-with-fluid-width", args as Record<string, string | boolean>, SLOT),
    args: {
        "padding-inline": "2rem",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
