import type { Meta, StoryObj } from "@storybook/angular";
import { FloatButton } from "./FloatButton";

const meta: Meta<FloatButton> = {
  title: "Headless/FloatButton",
  component: FloatButton,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<FloatButton>;

export const Default: Story = {};
