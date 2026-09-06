import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./hero-headline.js";
import { h } from "../stories/render.js";

const SLOT =
    '<img slot="media" src="https://placehold.co/1200x500" alt="Aerial view of city" /><h1>The Changing Skyline</h1><p>How urban development is reshaping cities</p>';

const meta: Meta = {
    title: "Content/HeroHeadline",
    render: (args) => h("lily-hero-headline", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Feature story",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
