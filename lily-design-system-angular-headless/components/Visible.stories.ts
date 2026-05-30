import type { Meta, StoryObj } from "@storybook/angular";
import { Visible } from "./Visible";

const meta: Meta<Visible> = {
  title: "Headless/Visible",
  component: Visible,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Visible>;

export const Default: Story = {};
