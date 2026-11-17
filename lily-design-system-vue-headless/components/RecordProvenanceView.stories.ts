import type { Meta, StoryObj } from "@storybook/vue3-vite";
import RecordProvenanceView from "./RecordProvenanceView.vue";

const meta = {
    title: "Headless/RecordProvenanceView",
    component: RecordProvenanceView,
    tags: ["autodocs"],
} satisfies Meta<typeof RecordProvenanceView>;

export default meta;
type Story = StoryObj<typeof meta>;

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
