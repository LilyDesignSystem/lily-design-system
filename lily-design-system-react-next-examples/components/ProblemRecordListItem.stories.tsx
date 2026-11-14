import type { Meta, StoryObj } from "@storybook/react-vite";
import ProblemRecordListItem from "./ProblemRecordListItem";

const meta = {
    title: "Headless/ProblemRecordListItem",
    component: ProblemRecordListItem,
    tags: ["autodocs"],
} satisfies Meta<typeof ProblemRecordListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        condition: "Type 2 diabetes",
        clinicalStatus: "active",
        clinicalStatusLabel: "Active",
        verificationStatus: "confirmed",
        verificationStatusLabel: "Confirmed",
        severityLabel: "Moderate",
        onset: "2019-06-01",
        onsetLabel: "Since June 2019",
        abatement: "2024-01-15",
        abatementLabel: "Resolved 15 Jan 2024",
    },
    render: (args) => (
        <ul>
            <ProblemRecordListItem {...args}></ProblemRecordListItem>
        </ul>
    ),
};
