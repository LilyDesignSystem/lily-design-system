import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./section-heading.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Navigation/SectionHeading",
    render: (args) => h("lily-section-heading", args as Record<string, string | boolean>, SLOT),
    args: {
        "heading": "Designed for healthcare",
        "eyebrow": "Why Lily",
        "subtitle": "Patient-first, clinician-tested, accessible by default.",
        "level": "2"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
