import type { Meta, StoryObj } from "@storybook/angular";
import { TagGroup } from "./TagGroup";

const meta: Meta<TagGroup> = {
  title: "Headless/TagGroup",
  component: TagGroup,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<TagGroup>;

export const Default: Story = {};
