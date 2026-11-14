import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<ul class="medication-record-list" data-status="known" aria-label="Current medicines"><li class="medication-record-list-item" data-status="active">ramipril 5 mg capsule, oral, once a day <span class="medication-record-list-item-status">Active</span> <time class="medication-record-list-item-effective" datetime="2025-03-03">Since 3 Mar 2025</time></li></ul>`;

const meta = {
    title: "Headless/MedicationRecordList",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
