import type { Meta, StoryObj } from "@storybook/vue3-vite";
import MedicationRecordList from "./MedicationRecordList.vue";

const meta = {
    title: "Headless/MedicationRecordList",
    component: MedicationRecordList,
    tags: ["autodocs"],
} satisfies Meta<typeof MedicationRecordList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { status: "known", statusLabel: "Current medicines" },
};

export const NoneKnown: Story = {
    args: { status: "none-known", statusLabel: "No known medicines" },
};
