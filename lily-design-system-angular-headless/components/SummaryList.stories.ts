import type { Meta, StoryObj } from "@storybook/angular";
import { SummaryList } from "./SummaryList";

const meta: Meta<SummaryList> = {
  title: "Headless/SummaryList",
  component: SummaryList,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<SummaryList>;

export const Default: Story = {};
