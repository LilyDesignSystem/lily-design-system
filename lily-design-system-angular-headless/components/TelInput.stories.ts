import type { Meta, StoryObj } from "@storybook/angular";
import { TelInput } from "./TelInput";

const meta: Meta<TelInput> = {
  title: "Headless/TelInput",
  component: TelInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<TelInput>;

export const Default: Story = {};
