import type { Meta, StoryObj } from "@storybook/angular";
import { ThemeSelectOption } from "./ThemeSelectOption";

const meta: Meta<ThemeSelectOption> = {
  title: "Headless/ThemeSelectOption",
  component: ThemeSelectOption,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ThemeSelectOption>;

export const Default: Story = {};
