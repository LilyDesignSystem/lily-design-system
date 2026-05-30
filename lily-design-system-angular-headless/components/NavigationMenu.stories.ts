import type { Meta, StoryObj } from "@storybook/angular";
import { NavigationMenu } from "./NavigationMenu";

const meta: Meta<NavigationMenu> = {
  title: "Headless/NavigationMenu",
  component: NavigationMenu,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<NavigationMenu>;

export const Default: Story = {};
