import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./immunization-record-list.js";
import { h } from "../stories/render.js";

const meta: Meta = {
    title: "Healthcare/ImmunizationRecordList",
    render: (args) =>
        h("lily-immunization-record-list", args as Record<string, string | boolean>, ""),
    args: { status: "none-known", "status-label": "No immunizations recorded" },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
