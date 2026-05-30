import type { Meta, StoryObj } from "@storybook/angular";
import { Badge } from "./Badge";

const meta: Meta<Badge> = {
  title: "Headless/Badge",
  component: Badge,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Badge>;

export const Default: Story = {};
