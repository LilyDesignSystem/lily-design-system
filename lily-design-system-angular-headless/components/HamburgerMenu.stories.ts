import type { Meta, StoryObj } from "@storybook/angular";
import { HamburgerMenu } from "./HamburgerMenu";

const meta: Meta<HamburgerMenu> = {
  title: "Headless/HamburgerMenu",
  component: HamburgerMenu,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<HamburgerMenu>;

export const Default: Story = {};
