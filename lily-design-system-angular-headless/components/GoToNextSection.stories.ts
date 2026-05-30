import type { Meta, StoryObj } from "@storybook/angular";
import { GoToNextSection } from "./GoToNextSection";

const meta: Meta<GoToNextSection> = {
  title: "Headless/GoToNextSection",
  component: GoToNextSection,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<GoToNextSection>;

export const Default: Story = {};
