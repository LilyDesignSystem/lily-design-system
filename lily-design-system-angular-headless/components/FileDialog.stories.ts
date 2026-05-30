import type { Meta, StoryObj } from "@storybook/angular";
import { FileDialog } from "./FileDialog";

const meta: Meta<FileDialog> = {
  title: "Headless/FileDialog",
  component: FileDialog,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<FileDialog>;

export const Default: Story = {};
