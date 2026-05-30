import type { Meta, StoryObj } from "@storybook/angular";
import { ScrollBar } from "./ScrollBar";

const meta: Meta<ScrollBar> = {
  title: "Headless/ScrollBar",
  component: ScrollBar,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ScrollBar>;

export const Default: Story = {};
