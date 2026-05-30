import type { Meta, StoryObj } from "@storybook/angular";
import { HorizontalScroller } from "./HorizontalScroller";

const meta: Meta<HorizontalScroller> = {
  title: "Headless/HorizontalScroller",
  component: HorizontalScroller,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<HorizontalScroller>;

export const Default: Story = {};
