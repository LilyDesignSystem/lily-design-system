import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./share-page.js";
import { h } from "../stories/render.js";

const SLOT = [
    '<a href="mailto:?subject=Check%20this%20out" aria-label="Share on email">Email</a>',
    '<button type="button" aria-label="Copy link">Copy link</button>',
].join("");

const meta: Meta = {
    title: "Content/SharePage",
    render: (args) => h("lily-share-page", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Share this page"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
