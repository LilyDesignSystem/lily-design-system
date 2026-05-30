import type { Meta, StoryObj } from "@storybook/angular";
import { ImageInput } from "./ImageInput";

const meta: Meta<ImageInput> = {
  title: "Headless/ImageInput",
  component: ImageInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ImageInput>;

export const Default: Story = {};
