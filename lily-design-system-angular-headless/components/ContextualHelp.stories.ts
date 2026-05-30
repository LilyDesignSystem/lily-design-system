import type { Meta, StoryObj } from "@storybook/angular";
import { ContextualHelp } from "./ContextualHelp";

const meta: Meta<ContextualHelp> = {
  title: "Headless/ContextualHelp",
  component: ContextualHelp,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ContextualHelp>;

export const Default: Story = {};
