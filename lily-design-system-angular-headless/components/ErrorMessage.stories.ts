import type { Meta, StoryObj } from "@storybook/angular";
import { ErrorMessage } from "./ErrorMessage";

const meta: Meta<ErrorMessage> = {
  title: "Headless/ErrorMessage",
  component: ErrorMessage,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ErrorMessage>;

export const Default: Story = {};
