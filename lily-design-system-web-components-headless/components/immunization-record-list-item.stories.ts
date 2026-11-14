import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./immunization-record-list-item.js";
import { h } from "../stories/render.js";

const meta: Meta = {
    title: "Healthcare/ImmunizationRecordListItem",
    render: (args) =>
        h("lily-immunization-record-list-item", args as Record<string, string | boolean>, ""),
    args: {
        vaccine: "MMR vaccine",
        occurrence: "2025-09-12",
        "occurrence-label": "12 Sep 2025",
        "dose-number-label": "Dose 2 of 2",
        status: "completed",
        "status-label": "Given",
        "lot-number": "AB1234",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
