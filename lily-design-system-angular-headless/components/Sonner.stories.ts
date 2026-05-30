import type { Meta, StoryObj } from "@storybook/angular";
import { Sonner } from "./Sonner";

const meta: Meta<Sonner> = {
  title: "Headless/Sonner",
  component: Sonner,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Sonner>;

export const Default: Story = {};
