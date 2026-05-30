import type { Meta, StoryObj } from "@storybook/angular";
import { GanttTableTr } from "./GanttTableTr";

const meta: Meta<GanttTableTr> = {
  title: "Headless/GanttTableTr",
  component: GanttTableTr,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<GanttTableTr>;

export const Default: Story = {};
