import type { Meta, StoryObj } from "@storybook/react-vite";
import HongKongIdentityCardInput from "./HongKongIdentityCardInput";

const meta = {
    title: "Headless/HongKongIdentityCardInput",
    component: HongKongIdentityCardInput,
    tags: ["autodocs"],
} satisfies Meta<typeof HongKongIdentityCardInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "HongKongIdentityCardInput" },
};
