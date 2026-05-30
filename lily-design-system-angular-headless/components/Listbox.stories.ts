import type { Meta, StoryObj } from "@storybook/angular";
import { Listbox } from "./Listbox";

const meta: Meta<Listbox> = {
  title: "Headless/Listbox",
  component: Listbox,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Listbox>;

export const Default: Story = {};
