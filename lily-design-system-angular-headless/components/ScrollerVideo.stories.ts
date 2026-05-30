import type { Meta, StoryObj } from "@storybook/angular";
import { ScrollerVideo } from "./ScrollerVideo";

const meta: Meta<ScrollerVideo> = {
  title: "Headless/ScrollerVideo",
  component: ScrollerVideo,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ScrollerVideo>;

export const Default: Story = {};
