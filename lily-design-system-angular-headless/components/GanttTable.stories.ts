import type { Meta, StoryObj } from "@storybook/angular";
import { GanttTable } from "./GanttTable";

const meta: Meta<GanttTable> = {
  title: "Headless/GanttTable",
  component: GanttTable,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<GanttTable>;

export const Default: Story = {};
