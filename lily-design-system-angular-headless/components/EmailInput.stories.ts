import type { Meta, StoryObj } from "@storybook/angular";
import { EmailInput } from "./EmailInput";

const meta: Meta<EmailInput> = {
  title: "Headless/EmailInput",
  component: EmailInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<EmailInput>;

export const Default: Story = {};
