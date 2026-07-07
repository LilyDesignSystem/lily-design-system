import type { Meta, StoryObj } from "@storybook/angular";
import { ImageCropper } from "./ImageCropper";

const meta: Meta<ImageCropper> = {
  title: "Headless/ImageCropper",
  component: ImageCropper,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ImageCropper>;

export const Default: Story = {
  args: {
    label: "Crop image",
  },
};
