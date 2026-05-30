import type { Meta, StoryObj } from "@storybook/angular";
import { GanttTableTD } from "./GanttTableTD";

const meta: Meta<GanttTableTD> = {
  title: "Headless/GanttTableTD",
  component: GanttTableTD,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<GanttTableTD>;

export const Default: Story = {};
