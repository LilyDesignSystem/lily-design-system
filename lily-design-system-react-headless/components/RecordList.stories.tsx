import type { Meta, StoryObj } from "@storybook/react-vite";
import RecordList from "./RecordList";
import RecordListItem from "./RecordListItem";

const meta = {
    title: "Headless/RecordList",
    component: RecordList,
    tags: ["autodocs"],
} satisfies Meta<typeof RecordList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { status: "known", statusLabel: "Vital signs" },
    render: (args) => (
        <RecordList {...args}>
            <RecordListItem
                status="final"
                statusLabel="Final"
                updated="2026-11-03"
                updatedLabel="Updated 3 Nov 2026"
            >
                Blood pressure 128/82 mmHg
            </RecordListItem>
        </RecordList>
    ),
};

export const NoneKnown: Story = {
    args: { status: "none-known", statusLabel: "No vital signs recorded" },
};
