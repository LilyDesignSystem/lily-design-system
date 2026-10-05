import type { Meta, StoryObj } from "@storybook/angular";
import { MultiSelect } from "./MultiSelect";

const meta: Meta<MultiSelect> = {
  title: "Headless/MultiSelect",
  component: MultiSelect,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<MultiSelect>;

export const Default: Story = {
  args: { label: "Pick" },
};
