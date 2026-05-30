import type { Meta, StoryObj } from "@storybook/angular";
import { Editable } from "./Editable";

const meta: Meta<Editable> = {
  title: "Headless/Editable",
  component: Editable,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Editable>;

export const Default: Story = {};
