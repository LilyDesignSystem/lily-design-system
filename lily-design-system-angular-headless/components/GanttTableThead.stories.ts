import type { Meta, StoryObj } from "@storybook/angular";
import { GanttTableThead } from "./GanttTableThead";

const meta: Meta<GanttTableThead> = {
  title: "Headless/GanttTableThead",
  component: GanttTableThead,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<GanttTableThead>;

export const Default: Story = {};
