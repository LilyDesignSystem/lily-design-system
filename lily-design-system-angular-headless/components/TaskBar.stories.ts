import type { Meta, StoryObj } from "@storybook/angular";
import { TaskBar } from "./TaskBar";

const meta: Meta<TaskBar> = {
  title: "Headless/TaskBar",
  component: TaskBar,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<TaskBar>;

export const Default: Story = {};
