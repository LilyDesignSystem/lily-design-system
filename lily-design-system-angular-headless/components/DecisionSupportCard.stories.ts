import type { Meta, StoryObj } from "@storybook/angular";
import { DecisionSupportCard } from "./DecisionSupportCard";

const meta: Meta<DecisionSupportCard> = {
    title: "Headless/DecisionSupportCard",
    component: DecisionSupportCard,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<DecisionSupportCard>;

export const Default: Story = {
    args: {
        summary: "Penicillin allergy recorded",
        indicator: "critical",
        indicatorLabel: "Critical",
        sourceLabel: "Local formulary",
        suggestions: [{ id: "cancel", label: "Cancel amoxicillin", isRecommended: true }],
        dismissLabel: "Dismiss",
        overrideReasons: [{ code: "aware", display: "Patient tolerated before" }],
        overrideReasonLabel: "Reason for dismissing",
        overrideReasonPlaceholder: "Choose a reason",
    },
};
