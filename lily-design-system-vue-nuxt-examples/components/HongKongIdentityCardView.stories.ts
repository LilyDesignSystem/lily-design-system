import type { Meta, StoryObj } from "@storybook/vue3-vite";
import HongKongIdentityCardView from "./HongKongIdentityCardView.vue";

const meta = {
    title: "Headless/HongKongIdentityCardView",
    component: HongKongIdentityCardView,
    tags: ["autodocs"],
} satisfies Meta<typeof HongKongIdentityCardView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "HongKongIdentityCardView" },
};
