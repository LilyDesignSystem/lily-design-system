import type { Meta, StoryObj } from "@storybook/angular";
import { TabBarButton } from "./TabBarButton";

const meta: Meta<TabBarButton> = {
  title: "Headless/TabBarButton",
  component: TabBarButton,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<TabBarButton>;

export const Default: Story = {};
