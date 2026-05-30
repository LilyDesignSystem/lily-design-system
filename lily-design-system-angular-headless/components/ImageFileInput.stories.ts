import type { Meta, StoryObj } from "@storybook/angular";
import { ImageFileInput } from "./ImageFileInput";

const meta: Meta<ImageFileInput> = {
  title: "Headless/ImageFileInput",
  component: ImageFileInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ImageFileInput>;

export const Default: Story = {};
