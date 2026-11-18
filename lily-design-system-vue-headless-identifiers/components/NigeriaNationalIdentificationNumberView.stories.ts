import type { Meta, StoryObj } from "@storybook/vue3-vite";
import NigeriaNationalIdentificationNumberView from "./NigeriaNationalIdentificationNumberView.vue";

const meta = {
    title: "Headless/NigeriaNationalIdentificationNumberView",
    component: NigeriaNationalIdentificationNumberView,
    tags: ["autodocs"],
} satisfies Meta<typeof NigeriaNationalIdentificationNumberView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "NigeriaNationalIdentificationNumberView" },
};
