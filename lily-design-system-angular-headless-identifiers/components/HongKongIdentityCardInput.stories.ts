import type { Meta, StoryObj } from "@storybook/angular";
import { HongKongIdentityCardInput } from "./HongKongIdentityCardInput";

const meta: Meta<HongKongIdentityCardInput> = {
    title: "Headless/HongKongIdentityCardInput",
    component: HongKongIdentityCardInput,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<HongKongIdentityCardInput>;

export const Default: Story = {};
