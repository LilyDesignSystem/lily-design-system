import type { Meta, StoryObj } from "@storybook/angular";
import { Kbd } from "./Kbd";

const meta: Meta<Kbd> = {
  title: "Headless/Kbd",
  component: Kbd,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Kbd>;

export const Default: Story = {};
