import type { Meta, StoryObj } from "@storybook/angular";
import { SubmitInput } from "./SubmitInput";

const meta: Meta<SubmitInput> = {
  title: "Headless/SubmitInput",
  component: SubmitInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<SubmitInput>;

export const Default: Story = {};
