import type { Meta, StoryObj } from "@storybook/angular";
import { RecordList } from "./RecordList";

const meta: Meta<RecordList> = {
    title: "Headless/RecordList",
    component: RecordList,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<RecordList>;

export const Default: Story = {
    render: () => ({
        template: `<lily-record-list status="none-known" statusLabel="No vital signs recorded"></lily-record-list>`,
    }),
};
