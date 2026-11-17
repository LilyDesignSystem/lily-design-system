import type { Meta, StoryObj } from "@storybook/angular";
import { RecordProvenanceView } from "./RecordProvenanceView";

const meta: Meta<RecordProvenanceView> = {
    title: "Headless/RecordProvenanceView",
    component: RecordProvenanceView,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<RecordProvenanceView>;

export const Default: Story = {
    args: {
        attestation: "pending",
        attestationLabel: "Awaiting signature",
        source: "device",
        sourceLabel: "From a blood pressure monitor",
        authorLabel: "Dr A Patel",
        recorded: "2026-11-03T09:00",
        recordedLabel: "Recorded 09:00",
    },
};
