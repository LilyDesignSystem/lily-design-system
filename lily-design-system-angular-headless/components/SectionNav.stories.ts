import type { Meta, StoryObj } from "@storybook/angular";
import { SectionNav } from "./SectionNav";

const meta: Meta<SectionNav> = {
  title: "Headless/SectionNav",
  component: SectionNav,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<SectionNav>;

export const Default: Story = {};
