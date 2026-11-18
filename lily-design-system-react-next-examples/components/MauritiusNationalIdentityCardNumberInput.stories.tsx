import type { Meta, StoryObj } from "@storybook/react-vite";
import MauritiusNationalIdentityCardNumberInput from "./MauritiusNationalIdentityCardNumberInput";

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
