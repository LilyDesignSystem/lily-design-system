import type { Meta, StoryObj } from "@storybook/angular";
import { Code } from "./Code";

const meta: Meta<Code> = {
  title: "Headless/Code",
  component: Code,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Code>;

export const Default: Story = {};
