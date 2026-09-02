import type { Meta, StoryObj } from "@storybook/angular";
import { TaskListItem } from "./TaskListItem";

// Attribute-selector component (`li[lily-task-list-item]`): Storybook's auto-render stub
// only knows how to mount an element selector as its own tag, so this story supplies
// the host <li> explicitly via `render`.
const meta: Meta<TaskListItem> = {
  title: "Headless/TaskListItem",
  component: TaskListItem,
  tags: ["autodocs"],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [TaskListItem] },
    template: `<li lily-task-list-item [className]="className"></li>`,
  }),
};

export default meta;
type Story = StoryObj<TaskListItem>;

export const Default: Story = {};
