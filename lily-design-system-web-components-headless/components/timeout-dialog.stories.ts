import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./timeout-dialog.js";
import { h } from "../stories/render.js";

const SLOT = "<p>You will be signed out soon.</p><button type=\"button\">Stay signed in</button><button type=\"button\">Sign out</button>";

const meta: Meta = {
    title: "Overlays/TimeoutDialog",
    render: (args) => h("lily-timeout-dialog", args as Record<string, string | boolean>, SLOT),
    args: {
        "title": "Session timeout",
        "remaining-seconds": "60",
        "open": true
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
