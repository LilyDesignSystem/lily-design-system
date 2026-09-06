import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./video-player.js";
import { h } from "../stories/render.js";

const SLOT = '<span slot="caption">Dr. Smith discusses recent findings</span>';

const meta: Meta = {
    title: "Content/VideoPlayer",
    render: (args) => h("lily-video-player", args as Record<string, string | boolean>, SLOT),
    args: {
        "src": "/videos/report.mp4",
        "label": "Interview with climate scientist",
        "poster": "/images/interview-poster.jpg",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
