import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./government-identifier.js";
import { h } from "../stories/render.js";

const SLOT =
    "<ul><li><a href=\"/about\">About</a></li><li><a href=\"/accessibility\">Accessibility</a></li><li><a href=\"/foia\">FOIA requests</a></li></ul>";

const meta: Meta = {
    title: "Navigation/GovernmentIdentifier",
    render: (args) => h("lily-government-identifier", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Agency identifier",
        "agency-name": "Example Agency",
        "agency-href": "https://example.gov",
        "description": "An official website of the Example Agency."
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
