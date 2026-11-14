import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<ul class="problem-record-list" data-status="known" aria-label="Problems"><li class="problem-record-list-item" data-clinical-status="active" data-verification-status="confirmed"><span class="problem-record-list-item-condition">Type 2 diabetes</span> <span class="problem-record-list-item-clinical-status">Active</span> <span class="problem-record-list-item-verification-status">Confirmed</span> <span class="problem-record-list-item-severity">Moderate</span> <time class="problem-record-list-item-onset" datetime="2019-06-01">Since June 2019</time> <time class="problem-record-list-item-abatement" datetime="2024-01-15">Resolved 15 Jan 2024</time></li></ul>`;

const meta = {
    title: "Headless/ProblemRecordListItem",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
