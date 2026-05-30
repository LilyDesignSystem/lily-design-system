import type { Meta, StoryObj } from "@storybook/angular";
import { Form } from "./Form";

const meta: Meta<Form> = {
  title: "Headless/Form",
  component: Form,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Form>;

export const Default: Story = {};
