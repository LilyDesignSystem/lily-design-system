import type { Meta, StoryObj } from "@storybook/vue3-vite";
import AustraliaTaxFileNumberView from "./AustraliaTaxFileNumberView.vue";

const meta = {
    title: "Headless/AustraliaTaxFileNumberView",
    component: AustraliaTaxFileNumberView,
    tags: ["autodocs"],
} satisfies Meta<typeof AustraliaTaxFileNumberView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "AustraliaTaxFileNumberView" },
};
