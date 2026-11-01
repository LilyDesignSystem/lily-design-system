import type { Meta, StoryObj } from "@storybook/vue3-vite";
import AustraliaTaxFileNumberInput from "./AustraliaTaxFileNumberInput.vue";

const meta = {
    title: "Headless/AustraliaTaxFileNumberInput",
    component: AustraliaTaxFileNumberInput,
    tags: ["autodocs"],
} satisfies Meta<typeof AustraliaTaxFileNumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "AustraliaTaxFileNumberInput" },
};
