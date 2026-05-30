import type { Meta, StoryObj } from "@storybook/angular";
import { FloatingPanel } from "./FloatingPanel";

const meta: Meta<FloatingPanel> = {
  title: "Headless/FloatingPanel",
  component: FloatingPanel,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<FloatingPanel>;

export const Default: Story = {};
