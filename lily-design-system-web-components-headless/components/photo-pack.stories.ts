import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./photo-pack.js";
import { h } from "../stories/render.js";

const SLOT = "<figure>Beach</figure><figure>Mountains</figure><figure>City</figure>";

const meta: Meta = {
    title: "Content/PhotoPack",
    render: (args) => h("lily-photo-pack", args as Record<string, string | boolean>, SLOT),
    args: {
        label: "Holiday photos",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
