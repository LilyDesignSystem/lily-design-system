import type { Meta, StoryObj } from "@storybook/angular";
import { KanbanTableBody } from "./KanbanTableBody";

const meta: Meta<KanbanTableBody> = {
  title: "Headless/KanbanTableBody",
  component: KanbanTableBody,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<KanbanTableBody>;

export const Default: Story = {};
