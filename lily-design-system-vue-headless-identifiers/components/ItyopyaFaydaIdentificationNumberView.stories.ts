import type { Meta, StoryObj } from "@storybook/vue3-vite";
import ItyopyaFaydaIdentificationNumberView from "./ItyopyaFaydaIdentificationNumberView.vue";

const meta = {
    title: "Headless/ItyopyaFaydaIdentificationNumberView",
    component: ItyopyaFaydaIdentificationNumberView,
    tags: ["autodocs"],
} satisfies Meta<typeof ItyopyaFaydaIdentificationNumberView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "ItyopyaFaydaIdentificationNumberView" },
};
