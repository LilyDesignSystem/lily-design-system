import type { Meta, StoryObj } from "@storybook/angular";
import { MockupTabletLandscape } from "./MockupTabletLandscape";

const meta: Meta<MockupTabletLandscape> = {
  title: "Headless/MockupTabletLandscape",
  component: MockupTabletLandscape,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<MockupTabletLandscape>;

export const Default: Story = {};
