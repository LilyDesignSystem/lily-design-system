import type { Meta, StoryObj } from "@storybook/angular";
import { FileUpload } from "./FileUpload";

const meta: Meta<FileUpload> = {
  title: "Headless/FileUpload",
  component: FileUpload,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<FileUpload>;

export const Default: Story = {};
