import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./decision-support-card.js";
import { h } from "../stories/render.js";

const SLOT = `<p>Amoxicillin is a penicillin.</p>`;

const meta: Meta = {
    title: "Healthcare/DecisionSupportCard",
    render: (args) =>
        h("lily-decision-support-card", args as Record<string, string | boolean>, SLOT),
    args: {
        summary: "Penicillin allergy recorded",
        indicator: "critical",
        "indicator-label": "Critical",
        "source-label": "Local formulary",
        suggestions: '[{"id":"cancel","label":"Cancel amoxicillin","isRecommended":true}]',
        "dismiss-label": "Dismiss",
        "override-reasons": '[{"code":"aware","display":"Patient tolerated before"}]',
        "override-reason-label": "Reason for dismissing",
        "override-reason-placeholder": "Choose a reason",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
