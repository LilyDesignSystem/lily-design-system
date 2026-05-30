import type { Meta, StoryObj } from "@storybook/angular";
import { ThemeSelect } from "./ThemeSelect";

const meta: Meta<ThemeSelect> = {
  title: "Headless/ThemeSelect",
  component: ThemeSelect,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ThemeSelect>;

export const Default: Story = {};
