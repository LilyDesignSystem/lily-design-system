import type { Meta, StoryObj } from "@storybook/angular";
import { Cascader } from "./Cascader";

const meta: Meta<Cascader> = {
  title: "Headless/Cascader",
  component: Cascader,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Cascader>;

export const Default: Story = {};
