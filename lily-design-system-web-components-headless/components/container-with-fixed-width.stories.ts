import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./container-with-fixed-width.js";
import { h } from "../stories/render.js";

const SLOT = "<article>Centered content, capped to a fixed max-width.</article>";

const meta: Meta = {
    title: "Content/ContainerWithFixedWidth",
    render: (args) => h("lily-container-with-fixed-width", args as Record<string, string | boolean>, SLOT),
    args: {
        "max-width": "960px",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
