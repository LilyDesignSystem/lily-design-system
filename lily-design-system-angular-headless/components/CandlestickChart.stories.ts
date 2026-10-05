import type { Meta, StoryObj } from "@storybook/angular";
import { CandlestickChart } from "./CandlestickChart";

const meta: Meta<CandlestickChart> = {
  title: "Headless/CandlestickChart",
  component: CandlestickChart,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<CandlestickChart>;

export const Default: Story = {};
