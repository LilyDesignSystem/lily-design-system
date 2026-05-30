import type { Meta, StoryObj } from "@storybook/angular";
import { ToggleGroup } from "./ToggleGroup";

const meta: Meta<ToggleGroup> = {
  title: "Headless/ToggleGroup",
  component: ToggleGroup,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ToggleGroup>;

export const Default: Story = {};
