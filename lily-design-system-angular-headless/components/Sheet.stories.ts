import type { Meta, StoryObj } from "@storybook/angular";
import { Sheet } from "./Sheet";

const meta: Meta<Sheet> = {
  title: "Headless/Sheet",
  component: Sheet,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Sheet>;

export const Default: Story = {};
