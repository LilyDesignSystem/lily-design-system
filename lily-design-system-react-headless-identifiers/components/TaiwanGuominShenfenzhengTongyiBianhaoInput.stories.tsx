import type { Meta, StoryObj } from "@storybook/react-vite";
import TaiwanGuominShenfenzhengTongyiBianhaoInput from "./TaiwanGuominShenfenzhengTongyiBianhaoInput";

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
