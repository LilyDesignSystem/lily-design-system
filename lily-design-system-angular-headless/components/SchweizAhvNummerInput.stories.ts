import type { Meta, StoryObj } from "@storybook/angular";
import { SchweizAhvNummerInput } from "./SchweizAhvNummerInput";

const meta: Meta<SchweizAhvNummerInput> = {
  title: "Headless/SchweizAhvNummerInput",
  component: SchweizAhvNummerInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<SchweizAhvNummerInput>;

export const Default: Story = {};
