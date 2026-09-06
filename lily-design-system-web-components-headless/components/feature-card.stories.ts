import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./feature-card.js";
import { h } from "../stories/render.js";

const SLOT = "<a href=\"/learn-more\">Learn more</a>";

const meta: Meta = {
    title: "Navigation/FeatureCard",
    render: (args) => h("lily-feature-card", args as Record<string, string | boolean>, SLOT),
    args: {
        "heading": "Privacy first",
        "description": "Your data stays yours.",
        "image-url": "https://placehold.co/320x180",
        "image-alt": ""
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
