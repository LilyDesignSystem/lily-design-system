import type { Meta, StoryObj } from "@storybook/vue3-vite";
import VietNamCanCuocCongDanInput from "./VietNamCanCuocCongDanInput.vue";

const meta = {
    title: "Headless/VietNamCanCuocCongDanInput",
    component: VietNamCanCuocCongDanInput,
    tags: ["autodocs"],
} satisfies Meta<typeof VietNamCanCuocCongDanInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "VietNamCanCuocCongDanInput" },
};
