import type { Meta, StoryObj } from "@storybook/angular";
import { TaskBarButton } from "./TaskBarButton";

const meta: Meta<TaskBarButton> = {
  title: "Headless/TaskBarButton",
  component: TaskBarButton,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<TaskBarButton>;

export const Default: Story = {};
