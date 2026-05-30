import type { Meta, StoryObj } from "@storybook/angular";
import { Combobox } from "./Combobox";

const meta: Meta<Combobox> = {
  title: "Headless/Combobox",
  component: Combobox,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Combobox>;

export const Default: Story = {};
