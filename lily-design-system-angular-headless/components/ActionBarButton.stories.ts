import type { Meta, StoryObj } from "@storybook/angular";
import { ActionBarButton } from "./ActionBarButton";

const meta: Meta<ActionBarButton> = {
  title: "Headless/ActionBarButton",
  component: ActionBarButton,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ActionBarButton>;

export const Default: Story = {};
