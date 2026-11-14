import type { Meta, StoryObj } from "@storybook/react-vite";
import ProblemRecordList from "./ProblemRecordList";
import ProblemRecordListItem from "./ProblemRecordListItem";

const meta = {
    title: "Headless/ProblemRecordList",
    component: ProblemRecordList,
    tags: ["autodocs"],
} satisfies Meta<typeof ProblemRecordList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { status: "known", statusLabel: "Problems" },
    render: (args) => (
        <ProblemRecordList {...args}>
            <ProblemRecordListItem
                condition="Type 2 diabetes"
                clinicalStatus="active"
                clinicalStatusLabel="Active"
                verificationStatus="confirmed"
                verificationStatusLabel="Confirmed"
                severityLabel="Moderate"
                onset="2019-06-01"
                onsetLabel="Since June 2019"
                abatement="2024-01-15"
                abatementLabel="Resolved 15 Jan 2024"
            />
        </ProblemRecordList>
    ),
};

export const NoneKnown: Story = {
    args: { status: "none-known", statusLabel: "No known problems" },
};
