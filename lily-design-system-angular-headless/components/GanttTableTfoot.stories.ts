import type { Meta, StoryObj } from "@storybook/angular";
import { GanttTableTfoot } from "./GanttTableTfoot";

const meta: Meta<GanttTableTfoot> = {
  title: "Headless/GanttTableTfoot",
  component: GanttTableTfoot,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<GanttTableTfoot>;

export const Default: Story = {};
