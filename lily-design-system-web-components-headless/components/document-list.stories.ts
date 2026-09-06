import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./document-list.js";

import { h } from "../stories/render.js";

const SLOT = "<li>Report.pdf</li><li>Contract.pdf</li>";

const meta: Meta = {
    title: "Lists/DocumentList",
    render: (args) => h("lily-document-list", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Attachments",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
