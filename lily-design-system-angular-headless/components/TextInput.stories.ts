import type { Meta, StoryObj } from "@storybook/angular";
import { TextInput } from "./TextInput";

const meta: Meta<TextInput> = {
  title: "Headless/TextInput",
  component: TextInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<TextInput>;

export const Default: Story = {};
