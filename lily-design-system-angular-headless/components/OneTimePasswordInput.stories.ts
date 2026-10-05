import type { Meta, StoryObj } from "@storybook/angular";
import { OneTimePasswordInput } from "./OneTimePasswordInput";

const meta: Meta<OneTimePasswordInput> = {
  title: "Headless/OneTimePasswordInput",
  component: OneTimePasswordInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<OneTimePasswordInput>;

export const Default: Story = {
  args: { label: "Verification code", length: 6 },
};
