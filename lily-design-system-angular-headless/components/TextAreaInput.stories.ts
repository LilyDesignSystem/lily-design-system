import type { Meta, StoryObj } from "@storybook/angular";
import { TextAreaInput } from "./TextAreaInput";

const meta: Meta<TextAreaInput> = {
  title: "Headless/TextAreaInput",
  component: TextAreaInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<TextAreaInput>;

export const Default: Story = {};
