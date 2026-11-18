import type { Meta, StoryObj } from "@storybook/vue3-vite";
import MauritiusNationalIdentityCardNumberView from "./MauritiusNationalIdentityCardNumberView.vue";

const meta = {
    title: "Headless/MauritiusNationalIdentityCardNumberView",
    component: MauritiusNationalIdentityCardNumberView,
    tags: ["autodocs"],
} satisfies Meta<typeof MauritiusNationalIdentityCardNumberView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "MauritiusNationalIdentityCardNumberView" },
};
