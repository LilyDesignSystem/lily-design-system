import type { Meta, StoryObj } from "@storybook/angular";
import { KanbanTableTH } from "./KanbanTableTH";

const meta: Meta<KanbanTableTH> = {
  title: "Headless/KanbanTableTH",
  component: KanbanTableTH,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<KanbanTableTH>;

export const Default: Story = {};
