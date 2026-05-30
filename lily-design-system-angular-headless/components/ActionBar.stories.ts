import type { Meta, StoryObj } from "@storybook/angular";
import { ActionBar } from "./ActionBar";

const meta: Meta<ActionBar> = {
  title: "Headless/ActionBar",
  component: ActionBar,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ActionBar>;

export const Default: Story = {};
