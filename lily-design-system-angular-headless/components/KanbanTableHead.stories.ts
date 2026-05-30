import type { Meta, StoryObj } from "@storybook/angular";
import { KanbanTableHead } from "./KanbanTableHead";

const meta: Meta<KanbanTableHead> = {
  title: "Headless/KanbanTableHead",
  component: KanbanTableHead,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<KanbanTableHead>;

export const Default: Story = {};
