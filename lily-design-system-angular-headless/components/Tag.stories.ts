import type { Meta, StoryObj } from "@storybook/angular";
import { Tag } from "./Tag";

const meta: Meta<Tag> = {
  title: "Headless/Tag",
  component: Tag,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Tag>;

export const Default: Story = {};
