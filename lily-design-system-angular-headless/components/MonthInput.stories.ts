import type { Meta, StoryObj } from "@storybook/angular";
import { MonthInput } from "./MonthInput";

const meta: Meta<MonthInput> = {
  title: "Headless/MonthInput",
  component: MonthInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<MonthInput>;

export const Default: Story = {};
