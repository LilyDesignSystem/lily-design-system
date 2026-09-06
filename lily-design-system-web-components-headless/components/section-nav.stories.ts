import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./section-nav.js";
import { h } from "../stories/render.js";

const SLOT = '<ol><li><a href="/section-a">Section A</a></li><li><a href="/section-b" aria-current="page">Section B</a></li></ol>';

const meta: Meta = {
    title: "Navigation/SectionNav",
    render: (args) => h("lily-section-nav", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "In this section"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
