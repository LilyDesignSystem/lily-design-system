import type { Meta, StoryObj } from "@storybook/angular";
import { ProblemRecordList } from "./ProblemRecordList";

const meta: Meta<ProblemRecordList> = {
    title: "Headless/ProblemRecordList",
    component: ProblemRecordList,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ProblemRecordList>;

export const Default: Story = {
    render: () => ({
        template: `<lily-problem-record-list status="none-known" statusLabel="No known problems"></lily-problem-record-list>`,
    }),
};
