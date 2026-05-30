import type { Meta, StoryObj } from "@storybook/angular";
import { MockupWindow } from "./MockupWindow";

const meta: Meta<MockupWindow> = {
  title: "Headless/MockupWindow",
  component: MockupWindow,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<MockupWindow>;

export const Default: Story = {};
