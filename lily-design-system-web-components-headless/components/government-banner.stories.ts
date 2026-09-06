import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./government-banner.js";
import { h } from "../stories/render.js";

const SLOT =
    "<p>Official websites use .gov.</p><p>Secure .gov websites use HTTPS. A lock means you've safely connected.</p>";

const meta: Meta = {
    title: "Overlays/GovernmentBanner",
    render: (args) => h("lily-government-banner", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Official government website",
        "header-text": "An official website of the government",
        "expand-label": "Here's how you know"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
