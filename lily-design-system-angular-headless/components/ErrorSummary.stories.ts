import type { Meta, StoryObj } from "@storybook/angular";
import { ErrorSummary } from "./ErrorSummary";

const meta: Meta<ErrorSummary> = {
  title: "Headless/ErrorSummary",
  component: ErrorSummary,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ErrorSummary>;

export const Default: Story = {};
