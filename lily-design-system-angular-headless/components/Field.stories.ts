import type { Meta, StoryObj } from "@storybook/angular";
import { Field } from "./Field";

const meta: Meta<Field> = {
  title: "Headless/Field",
  component: Field,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Field>;

export const Default: Story = {};
