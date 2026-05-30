import type { Meta, StoryObj } from "@storybook/angular";
import { KanbanTableTD } from "./KanbanTableTD";

const meta: Meta<KanbanTableTD> = {
  title: "Headless/KanbanTableTD",
  component: KanbanTableTD,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<KanbanTableTD>;

export const Default: Story = {};
