import type { Meta, StoryObj } from "@storybook/angular";
import { SectionLink } from "./SectionLink";

const meta: Meta<SectionLink> = {
  title: "Headless/SectionLink",
  component: SectionLink,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<SectionLink>;

export const Default: Story = {};
