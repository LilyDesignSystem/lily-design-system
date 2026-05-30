import type { Meta, StoryObj } from "@storybook/angular";
import { AvatarImage } from "./AvatarImage";

const meta: Meta<AvatarImage> = {
  title: "Headless/AvatarImage",
  component: AvatarImage,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<AvatarImage>;

export const Default: Story = {};
