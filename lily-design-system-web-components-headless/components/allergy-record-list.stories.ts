import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./allergy-record-list.js";
import { h } from "../stories/render.js";

const meta: Meta = {
    title: "Healthcare/AllergyRecordList",
    render: (args) => h("lily-allergy-record-list", args as Record<string, string | boolean>, ""),
    args: { status: "none-known", "status-label": "No known allergies" },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
