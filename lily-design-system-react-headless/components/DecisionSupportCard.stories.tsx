import type { Meta, StoryObj } from "@storybook/react-vite";
import DecisionSupportCard from "./DecisionSupportCard";

const meta = {
    title: "Headless/DecisionSupportCard",
    component: DecisionSupportCard,
    tags: ["autodocs"],
} satisfies Meta<typeof DecisionSupportCard>;

export default meta;
type Story = StoryObj<typeof meta>;

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
