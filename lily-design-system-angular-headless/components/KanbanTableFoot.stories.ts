import type { Meta, StoryObj } from "@storybook/angular";
import { KanbanTableFoot } from "./KanbanTableFoot";

const meta: Meta<KanbanTableFoot> = {
  title: "Headless/KanbanTableFoot",
  component: KanbanTableFoot,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<KanbanTableFoot>;

export const Default: Story = {};
