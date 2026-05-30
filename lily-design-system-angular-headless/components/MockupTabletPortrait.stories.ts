import type { Meta, StoryObj } from "@storybook/angular";
import { MockupTabletPortrait } from "./MockupTabletPortrait";

const meta: Meta<MockupTabletPortrait> = {
  title: "Headless/MockupTabletPortrait",
  component: MockupTabletPortrait,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<MockupTabletPortrait>;

export const Default: Story = {};
