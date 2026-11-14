import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./medication-record-list.js";
import { h } from "../stories/render.js";

const meta: Meta = {
    title: "Healthcare/MedicationRecordList",
    render: (args) =>
        h("lily-medication-record-list", args as Record<string, string | boolean>, ""),
    args: { status: "none-known", "status-label": "No known medicines" },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
