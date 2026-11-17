import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<span class="record-provenance-view" data-attestation="pending" data-source="device"><span class="record-provenance-view-attestation">Awaiting signature</span> <span class="record-provenance-view-source">From a blood pressure monitor</span> <span class="record-provenance-view-author">Dr A Patel</span> <time class="record-provenance-view-recorded" datetime="2026-11-03T09:00">Recorded 09:00</time></span>`;

const meta = {
    title: "Headless/RecordProvenanceView",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
