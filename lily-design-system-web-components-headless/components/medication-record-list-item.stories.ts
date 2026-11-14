import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./medication-record-list-item.js";
import { h } from "../stories/render.js";

const meta: Meta = {
    title: "Healthcare/MedicationRecordListItem",
    render: (args) =>
        h(
            "lily-medication-record-list-item",
            args as Record<string, string | boolean>,
            "ramipril 5 mg capsule, oral, once a day",
        ),
    args: {
        status: "active",
        "status-label": "Active",
        effective: "2025-03-03",
        "effective-label": "Since 3 Mar 2025",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
