import type { Meta, StoryObj } from "@storybook/angular";
import { SplitView } from "./SplitView";

const meta: Meta<SplitView> = {
  title: "Headless/SplitView",
  component: SplitView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<SplitView>;

export const Default: Story = {};
