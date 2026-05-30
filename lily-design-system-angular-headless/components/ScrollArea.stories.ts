import type { Meta, StoryObj } from "@storybook/angular";
import { ScrollArea } from "./ScrollArea";

const meta: Meta<ScrollArea> = {
  title: "Headless/ScrollArea",
  component: ScrollArea,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ScrollArea>;

export const Default: Story = {};
