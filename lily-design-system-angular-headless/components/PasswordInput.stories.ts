import type { Meta, StoryObj } from "@storybook/angular";
import { PasswordInput } from "./PasswordInput";

const meta: Meta<PasswordInput> = {
  title: "Headless/PasswordInput",
  component: PasswordInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<PasswordInput>;

export const Default: Story = {};
