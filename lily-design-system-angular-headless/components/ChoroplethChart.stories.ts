import type { Meta, StoryObj } from "@storybook/angular";
import { ChoroplethChart } from "./ChoroplethChart";

const meta: Meta<ChoroplethChart> = {
  title: "Headless/ChoroplethChart",
  component: ChoroplethChart,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ChoroplethChart>;

export const Default: Story = {};
