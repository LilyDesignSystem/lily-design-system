import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./download-button.js";
import { h } from "../stories/render.js";

const SLOT = "Download report";

const meta: Meta = {
    title: "Links/DownloadButton",
    render: (args) => h("lily-download-button", args as Record<string, string | boolean>, SLOT),
    args: {
        "href": "/files/report.pdf",
        "label": "Download annual report (PDF, 2.4 MB)",
        "file-size": "2.4 MB",
        "file-format": "PDF",
        "download": "annual-report.pdf"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
