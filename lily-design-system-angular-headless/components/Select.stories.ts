import type { Meta, StoryObj } from "@storybook/angular";
import { Select } from "./Select";

const meta: Meta<Select> = {
  title: "Headless/Select",
  component: Select,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Select>;

export const Default: Story = {};
