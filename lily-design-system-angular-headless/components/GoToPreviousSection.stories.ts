import type { Meta, StoryObj } from "@storybook/angular";
import { GoToPreviousSection } from "./GoToPreviousSection";

const meta: Meta<GoToPreviousSection> = {
  title: "Headless/GoToPreviousSection",
  component: GoToPreviousSection,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<GoToPreviousSection>;

export const Default: Story = {};
