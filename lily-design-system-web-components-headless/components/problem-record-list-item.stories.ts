import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./problem-record-list-item.js";
import { h } from "../stories/render.js";

const meta: Meta = {
    title: "Healthcare/ProblemRecordListItem",
    render: (args) =>
        h("lily-problem-record-list-item", args as Record<string, string | boolean>, ""),
    args: {
        condition: "Type 2 diabetes",
        "clinical-status": "active",
        "clinical-status-label": "Active",
        "verification-status": "confirmed",
        "verification-status-label": "Confirmed",
        "severity-label": "Moderate",
        onset: "2019-06-01",
        "onset-label": "Since June 2019",
        abatement: "2024-01-15",
        "abatement-label": "Resolved 15 Jan 2024",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
