import type { Meta, StoryObj } from "@storybook/vue3-vite";
import AgeView from "./AgeView.vue";

const meta = {
    title: "Headless/AgeView",
    component: AgeView,
    tags: ["autodocs"],
} satisfies Meta<typeof AgeView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { label: "Age", value: "3 weeks 2 days", duration: "P23D" } };
