import type { Meta, StoryObj } from "@storybook/vue3-vite";
import IranKodEMelliInput from "./IranKodEMelliInput.vue";

const meta = {
    title: "Headless/IranKodEMelliInput",
    component: IranKodEMelliInput,
    tags: ["autodocs"],
} satisfies Meta<typeof IranKodEMelliInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "IranKodEMelliInput" },
};
