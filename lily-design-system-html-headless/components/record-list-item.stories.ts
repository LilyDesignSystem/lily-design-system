import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<ul class="record-list" data-status="known" aria-label="Vital signs"><li class="record-list-item" data-status="final">Blood pressure 128/82 mmHg <span class="record-list-item-status">Final</span> <time class="record-list-item-updated" datetime="2026-11-03">Updated 3 Nov 2026</time></li></ul>`;

const meta = {
    title: "Headless/RecordListItem",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
