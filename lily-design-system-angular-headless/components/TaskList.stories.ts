import type { Meta, StoryObj } from "@storybook/angular";
import { TaskList } from "./TaskList";

const meta: Meta<TaskList> = {
  title: "Headless/TaskList",
  component: TaskList,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<TaskList>;

export const Default: Story = {};
