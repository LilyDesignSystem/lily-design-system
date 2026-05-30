import type { Meta, StoryObj } from "@storybook/angular";
import { AvatarGroup } from "./AvatarGroup";

const meta: Meta<AvatarGroup> = {
  title: "Headless/AvatarGroup",
  component: AvatarGroup,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<AvatarGroup>;

export const Default: Story = {};
