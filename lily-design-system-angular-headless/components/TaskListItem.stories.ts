import type { Meta, StoryObj } from "@storybook/angular";
import { TaskListItem } from "./TaskListItem";

const meta: Meta<TaskListItem> = {
  title: "Headless/TaskListItem",
  component: TaskListItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<TaskListItem>;

export const Default: Story = {};
