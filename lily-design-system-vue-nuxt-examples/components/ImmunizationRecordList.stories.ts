import type { Meta, StoryObj } from "@storybook/vue3-vite";
import ImmunizationRecordList from "./ImmunizationRecordList.vue";

const meta = {
    title: "Headless/ImmunizationRecordList",
    component: ImmunizationRecordList,
    tags: ["autodocs"],
} satisfies Meta<typeof ImmunizationRecordList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { status: "known", statusLabel: "Immunizations" },
};

export const NoneKnown: Story = {
    args: { status: "none-known", statusLabel: "No immunizations recorded" },
};
