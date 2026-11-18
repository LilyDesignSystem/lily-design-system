import type { Meta, StoryObj } from "@storybook/vue3-vite";
import HongKongIdentityCardInput from "./HongKongIdentityCardInput.vue";

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
