import type { Meta, StoryObj } from "@storybook/angular";
import { KanbanTable } from "./KanbanTable";

const meta: Meta<KanbanTable> = {
  title: "Headless/KanbanTable",
  component: KanbanTable,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<KanbanTable>;

export const Default: Story = {};
