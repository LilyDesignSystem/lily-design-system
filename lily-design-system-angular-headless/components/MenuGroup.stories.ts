import type { Meta, StoryObj } from "@storybook/angular";
import { MenuGroup } from "./MenuGroup";

const meta: Meta<MenuGroup> = {
  title: "Headless/MenuGroup",
  component: MenuGroup,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<MenuGroup>;

export const Default: Story = {};
