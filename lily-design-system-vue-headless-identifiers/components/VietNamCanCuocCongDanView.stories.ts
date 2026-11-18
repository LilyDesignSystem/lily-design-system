import type { Meta, StoryObj } from "@storybook/vue3-vite";
import VietNamCanCuocCongDanView from "./VietNamCanCuocCongDanView.vue";

const meta = {
    title: "Headless/VietNamCanCuocCongDanView",
    component: VietNamCanCuocCongDanView,
    tags: ["autodocs"],
} satisfies Meta<typeof VietNamCanCuocCongDanView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "VietNamCanCuocCongDanView" },
};
