import type { Meta, StoryObj } from "@storybook/angular";
import { TextAreaInputWithCharacterCounter } from "./TextAreaInputWithCharacterCounter";

const meta: Meta<TextAreaInputWithCharacterCounter> = {
  title: "Headless/TextAreaInputWithCharacterCounter",
  component: TextAreaInputWithCharacterCounter,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<TextAreaInputWithCharacterCounter>;

export const Default: Story = {};
