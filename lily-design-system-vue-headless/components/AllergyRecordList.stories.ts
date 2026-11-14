import type { Meta, StoryObj } from "@storybook/vue3-vite";
import AllergyRecordList from "./AllergyRecordList.vue";

const meta = {
    title: "Headless/AllergyRecordList",
    component: AllergyRecordList,
    tags: ["autodocs"],
} satisfies Meta<typeof AllergyRecordList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { status: "known", statusLabel: "Known allergies" },
};

export const NoneKnown: Story = {
    args: { status: "none-known", statusLabel: "No known allergies" },
};
