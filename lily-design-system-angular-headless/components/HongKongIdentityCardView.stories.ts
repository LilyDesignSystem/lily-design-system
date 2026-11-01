import type { Meta, StoryObj } from "@storybook/angular";
import { HongKongIdentityCardView } from "./HongKongIdentityCardView";

const meta: Meta<HongKongIdentityCardView> = {
    title: "Headless/HongKongIdentityCardView",
    component: HongKongIdentityCardView,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<HongKongIdentityCardView>;

export const Default: Story = {};
