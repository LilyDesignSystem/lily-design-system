import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./tile.js";
import { h } from "../stories/render.js";

const SLOT = "<h3>Patient summary</h3><p>View demographics, appointments, and history.</p>";

const meta: Meta = {
    title: "Content/Tile",
    render: (args) => h("lily-tile", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Patient summary",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
