import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./international-patient-summary.js";
import "./international-patient-summary-section.js";
import { h } from "../stories/render.js";

const meta: Meta = {
    title: "Healthcare/InternationalPatientSummary",
    render: (args) =>
        h("lily-international-patient-summary", args as Record<string, string | boolean>, ""),
    args: {
        label: "Patient summary",
        "contents-label": "Contents",
        "omitted-label": "Section missing from document",
        "required-headings": JSON.stringify({
            medications: "Medication summary",
            allergies: "Allergies and intolerances",
            problems: "Problem list",
        }),
        sections: JSON.stringify([
            { key: "problems", heading: "Problem list", status: "none-known" },
        ]),
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
