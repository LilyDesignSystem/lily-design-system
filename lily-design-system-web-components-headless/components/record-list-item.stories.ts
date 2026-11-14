import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./record-list-item.js";
import { h } from "../stories/render.js";

const meta: Meta = {
    title: "Healthcare/RecordListItem",
    render: (args) =>
        h(
            "lily-record-list-item",
            args as Record<string, string | boolean>,
            "Blood pressure 128/82 mmHg",
        ),
    args: {
        status: "final",
        "status-label": "Final",
        updated: "2026-11-03",
        "updated-label": "Updated 3 Nov 2026",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
