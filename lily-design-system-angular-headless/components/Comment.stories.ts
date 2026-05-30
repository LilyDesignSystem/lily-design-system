import type { Meta, StoryObj } from "@storybook/angular";
import { Comment } from "./Comment";

const meta: Meta<Comment> = {
  title: "Headless/Comment",
  component: Comment,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Comment>;

export const Default: Story = {};
