import type { Meta, StoryObj } from "@storybook/angular";
import { FunnelChart } from "./FunnelChart";

const meta: Meta<FunnelChart> = {
  title: "Headless/FunnelChart",
  component: FunnelChart,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<FunnelChart>;

export const Default: Story = {};
