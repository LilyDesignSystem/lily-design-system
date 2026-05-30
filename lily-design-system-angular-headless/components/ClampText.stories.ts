import type { Meta, StoryObj } from "@storybook/angular";
import { ClampText } from "./ClampText";

const meta: Meta<ClampText> = {
  title: "Headless/ClampText",
  component: ClampText,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ClampText>;

export const Default: Story = {};
