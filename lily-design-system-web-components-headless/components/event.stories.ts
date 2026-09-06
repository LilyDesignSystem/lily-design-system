import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./event.js";
import { h } from "../stories/render.js";

const SLOT = "<h2>Team meetup</h2><time datetime=\"2026-09-10\">10 September 2026</time><p>Community centre, main hall.</p>";

const meta: Meta = {
    title: "Navigation/Event",
    render: (args) => h("lily-event", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Team meetup"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
