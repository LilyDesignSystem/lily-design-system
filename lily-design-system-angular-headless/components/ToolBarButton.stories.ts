import type { Meta, StoryObj } from "@storybook/angular";
import { ToolBarButton } from "./ToolBarButton";

const meta: Meta<ToolBarButton> = {
  title: "Headless/ToolBarButton",
  component: ToolBarButton,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ToolBarButton>;

export const Default: Story = {};
