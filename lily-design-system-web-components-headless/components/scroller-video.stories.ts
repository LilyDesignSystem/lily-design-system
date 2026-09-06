import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./scroller-video.js";
import { h } from "../stories/render.js";

const SLOT = "<div>Step 1</div><div>Step 2</div><div>Step 3</div>";

const meta: Meta = {
    title: "Content/ScrollerVideo",
    render: (args) => h("lily-scroller-video", args as Record<string, string | boolean>, SLOT),
    args: {
        "src": "/media/harbour-timelapse.mp4",
        "label": "Our story in video",
        "alt": "A time-lapse of the harbour at dawn",
        "offset": "0.5"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
