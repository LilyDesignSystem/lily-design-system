import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span\n  class="record-provenance-view"\n  data-attestation="pending"\n  data-source="device"\n  ><span class="record-provenance-view-attestation">Awaiting signature</span>\n  <span class="record-provenance-view-source">From a blood pressure monitor</span>\n  <span class="record-provenance-view-author">Dr A Patel</span>\n  <time\n    class="record-provenance-view-recorded"\n    datetime="2026-11-03T09:00"\n    >Recorded 09:00</time\n  ></span\n>';

const meta = {
    title: "Headless/Record Provenance View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
