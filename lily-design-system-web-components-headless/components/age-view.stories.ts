import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./age-view.js";
import { h } from "../stories/render.js";

const SLOT = ``;

const meta: Meta = {
    title: "Healthcare/AgeView",
    render: (args) => h("lily-age-view", args as Record<string, string | boolean>, SLOT),
    args: { label: "Age", value: "3 weeks 2 days", duration: "P23D" },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
