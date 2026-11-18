import type { Meta, StoryObj } from "@storybook/vue3-vite";
import TaiwanGuominShenfenzhengTongyiBianhaoView from "./TaiwanGuominShenfenzhengTongyiBianhaoView.vue";

const meta = {
    title: "Headless/TaiwanGuominShenfenzhengTongyiBianhaoView",
    component: TaiwanGuominShenfenzhengTongyiBianhaoView,
    tags: ["autodocs"],
} satisfies Meta<typeof TaiwanGuominShenfenzhengTongyiBianhaoView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "TaiwanGuominShenfenzhengTongyiBianhaoView" },
};
