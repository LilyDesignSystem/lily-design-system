import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./care-card.js";
import { h } from "../stories/render.js";

const SLOT = "<ul><li>you have had symptoms for more than 3 days</li></ul>";

const meta: Meta = {
    title: "Content/CareCard",
    render: (args) => h("lily-care-card", args as Record<string, string | boolean>, SLOT),
    args: {
        "heading": "Speak to a GP if:",
        "type": "non-urgent",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
