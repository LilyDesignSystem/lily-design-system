import type { Meta, StoryObj } from "@storybook/angular";
import { ProblemRecordListItem } from "./ProblemRecordListItem";

const meta: Meta<ProblemRecordListItem> = {
    title: "Headless/ProblemRecordListItem",
    component: ProblemRecordListItem,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ProblemRecordListItem>;

export const Default: Story = {
    render: () => ({
        template: `<ul><li lily-problem-record-list-item condition="Type 2 diabetes" clinicalStatus="active" clinicalStatusLabel="Active" verificationStatus="confirmed" verificationStatusLabel="Confirmed" severityLabel="Moderate" onset="2019-06-01" onsetLabel="Since June 2019" abatement="2024-01-15" abatementLabel="Resolved 15 Jan 2024"></li></ul>`,
    }),
};
