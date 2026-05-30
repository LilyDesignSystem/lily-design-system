import type { Meta, StoryObj } from "@storybook/angular";
import { EmailLink } from "./EmailLink";

const meta: Meta<EmailLink> = {
  title: "Headless/EmailLink",
  component: EmailLink,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<EmailLink>;

export const Default: Story = {};
