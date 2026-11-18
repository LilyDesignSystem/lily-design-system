import type { Meta, StoryObj } from "@storybook/react-vite";
import MauritiusNationalIdentityCardNumberView from "./MauritiusNationalIdentityCardNumberView";

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
