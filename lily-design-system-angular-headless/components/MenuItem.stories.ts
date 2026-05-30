import type { Meta, StoryObj } from "@storybook/angular";
import { MenuItem } from "./MenuItem";

const meta: Meta<MenuItem> = {
  title: "Headless/MenuItem",
  component: MenuItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<MenuItem>;

export const Default: Story = {};
