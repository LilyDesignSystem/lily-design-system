import type { Meta, StoryObj } from "@storybook/angular";
import { FileInput } from "./FileInput";

const meta: Meta<FileInput> = {
  title: "Headless/FileInput",
  component: FileInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<FileInput>;

export const Default: Story = {};
