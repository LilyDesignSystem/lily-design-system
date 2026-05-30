import type { Meta, StoryObj } from "@storybook/angular";
import { ScrollerBase } from "./ScrollerBase";

const meta: Meta<ScrollerBase> = {
  title: "Headless/ScrollerBase",
  component: ScrollerBase,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ScrollerBase>;

export const Default: Story = {};
