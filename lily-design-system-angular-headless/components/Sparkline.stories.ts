import type { Meta, StoryObj } from "@storybook/angular";
import { Sparkline } from "./Sparkline";

const meta: Meta<Sparkline> = {
  title: "Headless/Sparkline",
  component: Sparkline,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Sparkline>;

export const Default: Story = {};
