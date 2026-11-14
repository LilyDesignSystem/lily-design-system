import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./allergy-record-list-item.js";
import { h } from "../stories/render.js";

const meta: Meta = {
    title: "Healthcare/AllergyRecordListItem",
    render: (args) =>
        h("lily-allergy-record-list-item", args as Record<string, string | boolean>, ""),
    args: {
        substance: "Penicillin",
        reaction: "Anaphylaxis",
        severity: "severe",
        "severity-label": "Severe",
        criticality: "high",
        "criticality-label": "High risk",
        "clinical-status": "active",
        "clinical-status-label": "Active",
        "verification-status": "confirmed",
        "verification-status-label": "Confirmed",
        "type-label": "Allergy",
        "category-label": "Medication",
        updated: "2026-11-03",
        "updated-label": "Updated 3 Nov 2026",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
