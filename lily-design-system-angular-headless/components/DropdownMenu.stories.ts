import type { Meta, StoryObj } from "@storybook/angular";
import { DropdownMenu } from "./DropdownMenu";

const meta: Meta<DropdownMenu> = {
  title: "Headless/DropdownMenu",
  component: DropdownMenu,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<DropdownMenu>;

export const Default: Story = {};
