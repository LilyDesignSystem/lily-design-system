import type { Meta, StoryObj } from "@storybook/angular";
import { FileTree } from "./FileTree";

const meta: Meta<FileTree> = {
  title: "Headless/FileTree",
  component: FileTree,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<FileTree>;

export const Default: Story = {
  args: { label: "Files" },
};
