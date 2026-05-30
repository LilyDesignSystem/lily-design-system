import type { Meta, StoryObj } from "@storybook/angular";
import { SkipLink } from "./SkipLink";

const meta: Meta<SkipLink> = {
  title: "Headless/SkipLink",
  component: SkipLink,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<SkipLink>;

export const Default: Story = {};
