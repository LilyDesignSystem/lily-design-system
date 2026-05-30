import type { Meta, StoryObj } from "@storybook/angular";
import { MockupWatch } from "./MockupWatch";

const meta: Meta<MockupWatch> = {
  title: "Headless/MockupWatch",
  component: MockupWatch,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<MockupWatch>;

export const Default: Story = {};
