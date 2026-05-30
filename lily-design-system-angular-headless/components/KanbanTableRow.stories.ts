import type { Meta, StoryObj } from "@storybook/angular";
import { KanbanTableRow } from "./KanbanTableRow";

const meta: Meta<KanbanTableRow> = {
  title: "Headless/KanbanTableRow",
  component: KanbanTableRow,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<KanbanTableRow>;

export const Default: Story = {};
