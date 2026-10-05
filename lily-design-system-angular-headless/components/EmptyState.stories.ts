import type { Meta, StoryObj } from "@storybook/angular";
import { EmptyState } from "./EmptyState";

const meta: Meta<EmptyState> = {
  title: "Headless/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<EmptyState>;

export const Default: Story = {
  args: { label: "Nothing here" },
};
