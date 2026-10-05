import type { Meta, StoryObj } from "@storybook/angular";
import { SunburstChart } from "./SunburstChart";

const meta: Meta<SunburstChart> = {
  title: "Headless/SunburstChart",
  component: SunburstChart,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<SunburstChart>;

export const Default: Story = {};
