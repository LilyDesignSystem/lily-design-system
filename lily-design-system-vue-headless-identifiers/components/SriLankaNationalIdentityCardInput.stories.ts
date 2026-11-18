import type { Meta, StoryObj } from "@storybook/vue3-vite";
import SriLankaNationalIdentityCardInput from "./SriLankaNationalIdentityCardInput.vue";

const meta = {
    title: "Headless/SriLankaNationalIdentityCardInput",
    component: SriLankaNationalIdentityCardInput,
    tags: ["autodocs"],
} satisfies Meta<typeof SriLankaNationalIdentityCardInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "SriLankaNationalIdentityCardInput" },
};
