import type { Meta, StoryObj } from "@storybook/angular";
import { SelectWithExtras } from "./SelectWithExtras";

const meta: Meta<SelectWithExtras> = {
  title: "Headless/SelectWithExtras",
  component: SelectWithExtras,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<SelectWithExtras>;

export const Default: Story = {};
