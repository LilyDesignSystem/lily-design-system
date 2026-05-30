import type { Meta, StoryObj } from "@storybook/angular";
import { PhotoPack } from "./PhotoPack";

const meta: Meta<PhotoPack> = {
  title: "Headless/PhotoPack",
  component: PhotoPack,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<PhotoPack>;

export const Default: Story = {};
