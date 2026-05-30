import type { Meta, StoryObj } from "@storybook/angular";
import { PostalCodeInput } from "./PostalCodeInput";

const meta: Meta<PostalCodeInput> = {
  title: "Headless/PostalCodeInput",
  component: PostalCodeInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<PostalCodeInput>;

export const Default: Story = {};
