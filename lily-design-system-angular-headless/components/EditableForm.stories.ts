import type { Meta, StoryObj } from "@storybook/angular";
import { EditableForm } from "./EditableForm";

const meta: Meta<EditableForm> = {
  title: "Headless/EditableForm",
  component: EditableForm,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<EditableForm>;

export const Default: Story = {};
