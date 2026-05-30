import type { Meta, StoryObj } from "@storybook/angular";
import { PasswordInputOrTextInputDiv } from "./PasswordInputOrTextInputDiv";

const meta: Meta<PasswordInputOrTextInputDiv> = {
  title: "Headless/PasswordInputOrTextInputDiv",
  component: PasswordInputOrTextInputDiv,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<PasswordInputOrTextInputDiv>;

export const Default: Story = {};
