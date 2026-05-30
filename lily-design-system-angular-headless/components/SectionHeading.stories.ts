import type { Meta, StoryObj } from "@storybook/angular";
import { SectionHeading } from "./SectionHeading";

const meta: Meta<SectionHeading> = {
  title: "Headless/SectionHeading",
  component: SectionHeading,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<SectionHeading>;

export const Default: Story = {};
