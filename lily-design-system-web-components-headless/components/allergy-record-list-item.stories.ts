import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./allergy-record-list-item.js";
import { h } from "../stories/render.js";

const SLOT = ``;

const meta: Meta = {
    title: "Healthcare/AllergyRecordListItem",
    render: (args) => h("lily-allergy-record-list-item", args as Record<string, string | boolean>, SLOT),
    args: {
        substance: "Penicillin",
        reaction: "Anaphylaxis",
        severity: "severe",
        "severity-label": "Severe",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
