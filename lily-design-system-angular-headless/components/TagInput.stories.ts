import type { Meta, StoryObj } from "@storybook/angular";
import { TagInput } from "./TagInput";

const meta: Meta<TagInput> = {
  title: "Headless/TagInput",
  component: TagInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<TagInput>;

export const Default: Story = {};
