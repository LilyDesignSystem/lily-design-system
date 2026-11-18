import type { Meta, StoryObj } from "@storybook/vue3-vite";
import GhanaCardPersonalIdentificationNumberView from "./GhanaCardPersonalIdentificationNumberView.vue";

const meta = {
    title: "Headless/GhanaCardPersonalIdentificationNumberView",
    component: GhanaCardPersonalIdentificationNumberView,
    tags: ["autodocs"],
} satisfies Meta<typeof GhanaCardPersonalIdentificationNumberView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "GhanaCardPersonalIdentificationNumberView" },
};
