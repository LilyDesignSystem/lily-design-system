import type { Meta, StoryObj } from "@storybook/angular";
import { Affix } from "./Affix";

const meta: Meta<Affix> = {
  title: "Headless/Affix",
  component: Affix,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Affix>;

export const Default: Story = {};
