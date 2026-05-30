import type { Meta, StoryObj } from "@storybook/angular";
import { FileManager } from "./FileManager";

const meta: Meta<FileManager> = {
  title: "Headless/FileManager",
  component: FileManager,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<FileManager>;

export const Default: Story = {};
