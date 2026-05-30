import type { Meta, StoryObj } from "@storybook/angular";
import { Diff } from "./Diff";

const meta: Meta<Diff> = {
  title: "Headless/Diff",
  component: Diff,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Diff>;

export const Default: Story = {};
