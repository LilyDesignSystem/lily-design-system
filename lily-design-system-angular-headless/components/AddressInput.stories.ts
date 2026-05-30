import type { Meta, StoryObj } from "@storybook/angular";
import { AddressInput } from "./AddressInput";

const meta: Meta<AddressInput> = {
  title: "Headless/AddressInput",
  component: AddressInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<AddressInput>;

export const Default: Story = {};
