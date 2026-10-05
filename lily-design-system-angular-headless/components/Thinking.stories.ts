import type { Meta, StoryObj } from "@storybook/angular";
import { Thinking } from "./Thinking";

const meta: Meta<Thinking> = {
  title: "Headless/Thinking",
  component: Thinking,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Thinking>;

export const Default: Story = {
  args: { label: "Reasoning" },
};
