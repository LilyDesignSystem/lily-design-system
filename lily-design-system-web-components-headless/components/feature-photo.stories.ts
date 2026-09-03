import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./feature-photo.js";
import { h } from "../stories/render.js";

const SLOT = "<span slot=\"caption\">A rescue dog at the shelter.</span><span slot=\"credit\">Photo: Jane Doe</span>";

const meta: Meta = {
    title: "Media and data/FeaturePhoto",
    render: (args) => h("lily-feature-photo", args as Record<string, string | boolean>, SLOT),
    args: {
        "src": "https://placehold.co/640x360",
        "alt": "A rescue dog"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
