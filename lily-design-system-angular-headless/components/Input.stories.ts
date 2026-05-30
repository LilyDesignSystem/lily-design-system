import type { Meta, StoryObj } from "@storybook/angular";
import { Input } from "./Input";

const meta: Meta<Input> = {
  title: "Headless/Input",
  component: Input,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Input>;

export const Default: Story = {};
