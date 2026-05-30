import type { Meta, StoryObj } from "@storybook/angular";
import { HiddenInput } from "./HiddenInput";

const meta: Meta<HiddenInput> = {
  title: "Headless/HiddenInput",
  component: HiddenInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<HiddenInput>;

export const Default: Story = {};
