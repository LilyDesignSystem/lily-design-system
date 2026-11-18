import type { Meta, StoryObj } from "@storybook/vue3-vite";
import GhanaCardPersonalIdentificationNumberInput from "./GhanaCardPersonalIdentificationNumberInput.vue";

const meta = {
    title: "Headless/GhanaCardPersonalIdentificationNumberInput",
    component: GhanaCardPersonalIdentificationNumberInput,
    tags: ["autodocs"],
} satisfies Meta<typeof GhanaCardPersonalIdentificationNumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "GhanaCardPersonalIdentificationNumberInput" },
};
