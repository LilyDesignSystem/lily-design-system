import type { Meta, StoryObj } from "@storybook/angular";
import { Citation } from "./Citation";

const meta: Meta<Citation> = {
  title: "Headless/Citation",
  component: Citation,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Citation>;

export const Default: Story = {};
