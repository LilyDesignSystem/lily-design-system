import type { Meta, StoryObj } from "@storybook/angular";
import { Label } from "./Label";

const meta: Meta<Label> = {
  title: "Headless/Label",
  component: Label,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Label>;

export const Default: Story = {};
