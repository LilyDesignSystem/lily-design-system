import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./mockup-phone-landscape.js";
import { h } from "../stories/render.js";

const SLOT = "<p>Video player</p>";

const meta: Meta = {
    title: "Content/MockupPhoneLandscape",
    render: (args) => h("lily-mockup-phone-landscape", args as Record<string, string | boolean>, SLOT),
    args: {
        label: "Preview of the video player",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
