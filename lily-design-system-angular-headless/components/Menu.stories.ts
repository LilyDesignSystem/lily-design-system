import type { Meta, StoryObj } from "@storybook/angular";
import { Menu } from "./Menu";

const meta: Meta<Menu> = {
  title: "Headless/Menu",
  component: Menu,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Menu>;

export const Default: Story = {};
