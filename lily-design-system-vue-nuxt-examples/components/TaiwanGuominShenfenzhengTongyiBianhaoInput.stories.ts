import type { Meta, StoryObj } from "@storybook/vue3-vite";
import TaiwanGuominShenfenzhengTongyiBianhaoInput from "./TaiwanGuominShenfenzhengTongyiBianhaoInput.vue";

const meta = {
    title: "Headless/TaiwanGuominShenfenzhengTongyiBianhaoInput",
    component: TaiwanGuominShenfenzhengTongyiBianhaoInput,
    tags: ["autodocs"],
} satisfies Meta<typeof TaiwanGuominShenfenzhengTongyiBianhaoInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "TaiwanGuominShenfenzhengTongyiBianhaoInput" },
};
