import type { Meta, StoryObj } from "@storybook/angular";
import { Option } from "./Option";

const meta: Meta<Option> = {
  title: "Headless/Option",
  component: Option,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Option>;

export const Default: Story = {};
