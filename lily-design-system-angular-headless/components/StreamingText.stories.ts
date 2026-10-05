import type { Meta, StoryObj } from "@storybook/angular";
import { StreamingText } from "./StreamingText";

const meta: Meta<StreamingText> = {
  title: "Headless/StreamingText",
  component: StreamingText,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<StreamingText>;

export const Default: Story = {};
