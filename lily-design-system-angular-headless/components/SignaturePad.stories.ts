import type { Meta, StoryObj } from "@storybook/angular";
import { SignaturePad } from "./SignaturePad";

const meta: Meta<SignaturePad> = {
  title: "Headless/SignaturePad",
  component: SignaturePad,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<SignaturePad>;

export const Default: Story = {};
