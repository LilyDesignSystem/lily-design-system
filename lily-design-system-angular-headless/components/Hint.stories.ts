import type { Meta, StoryObj } from "@storybook/angular";
import { Hint } from "./Hint";

const meta: Meta<Hint> = {
  title: "Headless/Hint",
  component: Hint,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Hint>;

export const Default: Story = {};
