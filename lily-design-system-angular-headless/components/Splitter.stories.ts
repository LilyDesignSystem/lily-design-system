import type { Meta, StoryObj } from "@storybook/angular";
import { Splitter } from "./Splitter";

const meta: Meta<Splitter> = {
  title: "Headless/Splitter",
  component: Splitter,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Splitter>;

export const Default: Story = {};
