import type { Meta, StoryObj } from "@storybook/angular";
import { ScreenReaderSpan } from "./ScreenReaderSpan";

const meta: Meta<ScreenReaderSpan> = {
  title: "Headless/ScreenReaderSpan",
  component: ScreenReaderSpan,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ScreenReaderSpan>;

export const Default: Story = {};
