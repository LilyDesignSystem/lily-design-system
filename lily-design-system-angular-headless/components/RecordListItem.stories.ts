import type { Meta, StoryObj } from "@storybook/angular";
import { RecordListItem } from "./RecordListItem";

const meta: Meta<RecordListItem> = {
    title: "Headless/RecordListItem",
    component: RecordListItem,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<RecordListItem>;

export const Default: Story = {
    render: () => ({
        template: `<ul><li lily-record-list-item status="final" statusLabel="Final" updated="2026-11-03" updatedLabel="Updated 3 Nov 2026">Blood pressure 128/82 mmHg</li></ul>`,
    }),
};
