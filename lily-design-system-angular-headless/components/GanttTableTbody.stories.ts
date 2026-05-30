import type { Meta, StoryObj } from "@storybook/angular";
import { GanttTableTbody } from "./GanttTableTbody";

const meta: Meta<GanttTableTbody> = {
  title: "Headless/GanttTableTbody",
  component: GanttTableTbody,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<GanttTableTbody>;

export const Default: Story = {};
