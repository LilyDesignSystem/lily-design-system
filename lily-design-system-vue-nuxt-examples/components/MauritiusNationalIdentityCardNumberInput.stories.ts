import type { Meta, StoryObj } from "@storybook/vue3-vite";
import MauritiusNationalIdentityCardNumberInput from "./MauritiusNationalIdentityCardNumberInput.vue";

const meta = {
    title: "Headless/MauritiusNationalIdentityCardNumberInput",
    component: MauritiusNationalIdentityCardNumberInput,
    tags: ["autodocs"],
} satisfies Meta<typeof MauritiusNationalIdentityCardNumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "MauritiusNationalIdentityCardNumberInput" },
};
