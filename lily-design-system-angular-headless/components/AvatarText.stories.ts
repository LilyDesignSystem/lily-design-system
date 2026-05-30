import type { Meta, StoryObj } from "@storybook/angular";
import { AvatarText } from "./AvatarText";

const meta: Meta<AvatarText> = {
  title: "Headless/AvatarText",
  component: AvatarText,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<AvatarText>;

export const Default: Story = {};
