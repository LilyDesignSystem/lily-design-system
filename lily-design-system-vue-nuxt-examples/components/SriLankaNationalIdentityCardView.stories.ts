import type { Meta, StoryObj } from "@storybook/vue3-vite";
import SriLankaNationalIdentityCardView from "./SriLankaNationalIdentityCardView.vue";

const meta = {
    title: "Headless/SriLankaNationalIdentityCardView",
    component: SriLankaNationalIdentityCardView,
    tags: ["autodocs"],
} satisfies Meta<typeof SriLankaNationalIdentityCardView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "SriLankaNationalIdentityCardView" },
};
