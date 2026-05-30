import type { Meta, StoryObj } from "@storybook/angular";
import { PaddingReset } from "./PaddingReset";

const meta: Meta<PaddingReset> = {
  title: "Headless/PaddingReset",
  component: PaddingReset,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<PaddingReset>;

export const Default: Story = {};
