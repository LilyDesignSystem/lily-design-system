import type { Meta, StoryObj } from "@storybook/angular";
import { Statistic } from "./Statistic";

const meta: Meta<Statistic> = {
  title: "Headless/Statistic",
  component: Statistic,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Statistic>;

export const Default: Story = {};
