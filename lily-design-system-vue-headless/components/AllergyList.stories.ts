import type { Meta, StoryObj } from "@storybook/vue3-vite";
import AllergyList from "./AllergyList.vue";

const meta = {
    title: "Headless/AllergyList",
    component: AllergyList,
    tags: ["autodocs"],
} satisfies Meta<typeof AllergyList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { status: "none-known", statusLabel: "No known allergies" } };
