import type { Meta, StoryObj } from "@storybook/angular";
import { Avatar } from "./Avatar";

const meta: Meta<Avatar> = {
  title: "Headless/Avatar",
  component: Avatar,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Avatar>;

export const Default: Story = {};
