import type { Meta, StoryObj } from "@storybook/angular";
import { MenuBar } from "./MenuBar";

const meta: Meta<MenuBar> = {
  title: "Headless/MenuBar",
  component: MenuBar,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<MenuBar>;

export const Default: Story = {};
