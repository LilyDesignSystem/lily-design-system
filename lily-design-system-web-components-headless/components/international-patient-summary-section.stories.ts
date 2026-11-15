import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./international-patient-summary-section.js";
import { h } from "../stories/render.js";

const meta: Meta = {
    title: "Healthcare/InternationalPatientSummarySection",
    render: (args) =>
        h(
            "lily-international-patient-summary-section",
            args as Record<string, string | boolean>,
            "",
        ),
    args: {
        section: "problems",
        heading: "Problem list",
        status: "not-recorded",
        "status-label": "Not recorded",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
