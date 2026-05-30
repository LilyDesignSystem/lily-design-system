import type { Meta, StoryObj } from "@storybook/angular";
import { GanttTableTH } from "./GanttTableTH";

const meta: Meta<GanttTableTH> = {
  title: "Headless/GanttTableTH",
  component: GanttTableTH,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<GanttTableTH>;

export const Default: Story = {};
