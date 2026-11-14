import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./procedure-record-list-item.js";
import { h } from "../stories/render.js";

const meta: Meta = {
    title: "Healthcare/ProcedureRecordListItem",
    render: (args) =>
        h("lily-procedure-record-list-item", args as Record<string, string | boolean>, ""),
    args: {
        procedure: "Appendectomy",
        status: "completed",
        "status-label": "Completed",
        performed: "2018-04-22",
        "performed-label": "22 Apr 2018",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
