import type { Meta, StoryObj } from "@storybook/angular";
import { MenuBarButton } from "./MenuBarButton";

const meta: Meta<MenuBarButton> = {
  title: "Headless/MenuBarButton",
  component: MenuBarButton,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<MenuBarButton>;

export const Default: Story = {};
