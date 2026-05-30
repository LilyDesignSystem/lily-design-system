import type { Meta, StoryObj } from "@storybook/angular";
import { SummaryBox } from "./SummaryBox";

const meta: Meta<SummaryBox> = {
  title: "Headless/SummaryBox",
  component: SummaryBox,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<SummaryBox>;

export const Default: Story = {};
