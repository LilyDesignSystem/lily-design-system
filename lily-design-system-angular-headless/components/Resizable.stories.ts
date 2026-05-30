import type { Meta, StoryObj } from "@storybook/angular";
import { Resizable } from "./Resizable";

const meta: Meta<Resizable> = {
  title: "Headless/Resizable",
  component: Resizable,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Resizable>;

export const Default: Story = {};
